package com.aibi.neerp.passwordreset.controller;

import com.aibi.neerp.client.service.ClientService;
import com.aibi.neerp.config.DataSourceConfig;
import com.aibi.neerp.config.TenantContext;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.passwordreset.dto.MagicLinkResetRequest;
import com.aibi.neerp.passwordreset.dto.StoreTokenRequest;
import com.aibi.neerp.passwordreset.entity.PasswordResetToken;
import com.aibi.neerp.passwordreset.repository.PasswordResetTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/password-reset")
public class PasswordResetController {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ClientService clientService;

    @Autowired
    private DataSourceConfig dataSourceConfig;

    @Autowired
    private DataSource dataSource;

    @PostMapping("/store-token")
    public ResponseEntity<?> storeToken(
            @RequestBody StoreTokenRequest request,
            HttpServletRequest httpRequest) {
        
        String tenantId = httpRequest.getHeader("X-Tenant");
        
        if (tenantId == null || tenantId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing X-Tenant header"));
        }

        if (!StringUtils.hasText(request.getEmail()) || !StringUtils.hasText(request.getToken())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and token are required"));
        }

        // Set up tenant datasource
        try {
            com.aibi.neerp.client.dto.Client client = clientService.getClientByDomain(tenantId);
            if (client == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Tenant not found"));
            }
            if (!Boolean.TRUE.equals(client.getIsActive())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Tenant is inactive"));
            }
            TenantContext.setTenantId(tenantId);
            dataSourceConfig.removeDataSource(tenantId);
            dataSourceConfig.addDataSource(tenantId, client);
            
            // Ensure table exists
            ensureTableExists();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to set up tenant datasource: " + e.getMessage()));
        }

        // Invalidate any existing tokens for this email
        tokenRepository.findByEmailAndUsedFalse(request.getEmail())
                .forEach(token -> {
                    token.setUsed(true);
                    tokenRepository.save(token);
                });

        // Store the new token (hashed)
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(request.getEmail());
        resetToken.setTokenHash(passwordEncoder.encode(request.getToken()));
        
        // Parse expiration time - handle ISO format with timezone
        // JavaScript sends ISO string like "2025-11-14T19:07:24.649Z" which is UTC
        // We need to convert it to LocalDateTime (server timezone)
        LocalDateTime expiresAt;
        try {
            String expiresAtStr = request.getExpiresAt();
            
            // Parse as Instant (UTC) then convert to LocalDateTime
            java.time.Instant instant = java.time.Instant.parse(expiresAtStr);
            expiresAt = LocalDateTime.ofInstant(instant, java.time.ZoneId.systemDefault());
            
            long minutesUntilExpiry = java.time.Duration.between(LocalDateTime.now(), expiresAt).toMinutes();
            
            if (minutesUntilExpiry <= 0) {
                expiresAt = LocalDateTime.now().plusHours(1);
            }
        } catch (Exception e) {
            // Default to 1 hour from now if parsing fails
            expiresAt = LocalDateTime.now().plusHours(1);
        }
        
        resetToken.setExpiresAt(expiresAt);
        resetToken.setUsed(false);
        resetToken.setCreatedAt(LocalDateTime.now());

        tokenRepository.save(resetToken);
        
        return ResponseEntity.ok(Map.of("success", true, "message", "Token stored successfully"));
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(
            @RequestBody MagicLinkResetRequest request,
            HttpServletRequest httpRequest) {
        
        String tenantId = httpRequest.getHeader("X-Tenant");
        
        if (tenantId == null || tenantId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing X-Tenant header"));
        }

        if (!StringUtils.hasText(request.getToken()) || !StringUtils.hasText(request.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token and password are required"));
        }

        if (request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters long"));
        }

        // Set up tenant datasource
        try {
            com.aibi.neerp.client.dto.Client client = clientService.getClientByDomain(tenantId);
            if (client == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Tenant not found"));
            }
            if (!Boolean.TRUE.equals(client.getIsActive())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Tenant is inactive"));
            }
            TenantContext.setTenantId(tenantId);
            dataSourceConfig.removeDataSource(tenantId);
            dataSourceConfig.addDataSource(tenantId, client);
            
            // Ensure table exists
            ensureTableExists();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to set up tenant datasource: " + e.getMessage()));
        }

        // Find token - get all unused tokens and check each one
        // Note: BCrypt hashing means we can't do direct lookup, so we check all recent tokens
        List<PasswordResetToken> allTokens;
        try {
            allTokens = tokenRepository.findAll();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to validate token. Please try again."));
        }
        
        if (allTokens.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid or expired token. Please request a new password reset link."));
        }
        
        List<PasswordResetToken> unusedTokens;
        try {
            unusedTokens = allTokens.stream()
                    .filter(token -> !token.isUsed())
                    .filter(token -> token.getExpiresAt().isAfter(LocalDateTime.now()))
                    .filter(token -> {
                        try {
                            return passwordEncoder.matches(request.getToken(), token.getTokenHash());
                        } catch (Exception e) {
                            return false;
                        }
                    })
                    .toList();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to validate token. Please try again."));
        }

        if (unusedTokens.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid or expired token. Please request a new password reset link."));
        }

        PasswordResetToken token = unusedTokens.get(0);

        // Find employee by email
        Optional<Employee> employeeOpt = employeeRepository.findByEmailIdAndActiveTrue(token.getEmail());
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        // Update password
        Employee employee = employeeOpt.get();
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employeeRepository.save(employee);

        // Mark token as used
        token.setUsed(true);
        tokenRepository.save(token);

        return ResponseEntity.ok(Map.of("success", true, "message", "Password reset successfully"));
    }

    /**
     * Ensures the tbl_password_reset_token table exists in the current tenant database.
     * This method creates a new JdbcTemplate with the current datasource to ensure
     * it uses the correct tenant database.
     */
    private void ensureTableExists() {
        try {
            // Create a new JdbcTemplate with the current datasource
            // This ensures we're using the tenant-specific datasource
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
            
            // Check if table exists
            String checkSql = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name = 'tbl_password_reset_token')";
            Boolean exists = jdbcTemplate.queryForObject(checkSql, Boolean.class);
            
            if (Boolean.TRUE.equals(exists)) {
                return;
            }
            
            // Table doesn't exist - create it
            String createTableSql = 
                "CREATE TABLE IF NOT EXISTS tbl_password_reset_token (" +
                "id BIGSERIAL PRIMARY KEY, " +
                "email VARCHAR(255) NOT NULL, " +
                "token_hash VARCHAR(255) NOT NULL, " +
                "expires_at TIMESTAMP NOT NULL, " +
                "used BOOLEAN NOT NULL DEFAULT FALSE, " +
                "created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP" +
                ")";
            jdbcTemplate.execute(createTableSql);
            
            // Create indexes for faster lookups
            try {
                String createEmailIndexSql = "CREATE INDEX IF NOT EXISTS idx_password_reset_token_email ON tbl_password_reset_token(email)";
                jdbcTemplate.execute(createEmailIndexSql);
            } catch (Exception e) {
                // Index may already exist, ignore
            }
            
            try {
                String createTokenHashIndexSql = "CREATE INDEX IF NOT EXISTS idx_password_reset_token_hash ON tbl_password_reset_token(token_hash)";
                jdbcTemplate.execute(createTokenHashIndexSql);
            } catch (Exception e) {
                // Index may already exist, ignore
            }
        } catch (Exception e) {
            // Don't throw - try to continue
        }
    }
}

