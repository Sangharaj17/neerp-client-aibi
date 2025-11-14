package com.aibi.neerp.employeemanagement.controller;

import com.aibi.neerp.employeemanagement.dto.ChangePasswordRequest;
import com.aibi.neerp.employeemanagement.dto.PasswordResetConfirmRequest;
import com.aibi.neerp.employeemanagement.dto.PasswordResetRequest;
import com.aibi.neerp.employeemanagement.dto.EmployeeResponseDto;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.employeemanagement.service.PasswordResetService;
import com.aibi.neerp.client.service.ClientService;
import com.aibi.neerp.config.DataSourceConfig;
import com.aibi.neerp.config.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetService passwordResetService;

    @Autowired
    private ClientService clientService;

    @Autowired
    private DataSourceConfig dataSourceConfig;

    @Value("${password.reset.internal.secret:}")
    private String internalResetSecret;

    public EmployeeController(EmployeeRepository employeeRepository,
                              PasswordEncoder passwordEncoder,
                              PasswordResetService passwordResetService) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetService = passwordResetService;
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @GetMapping("/executives")
    public List<EmployeeResponseDto> getExecutiveList() {
        return employeeRepository.findAll().stream()
                .map(emp -> new EmployeeResponseDto(emp.getEmployeeId(), emp.getEmployeeName()))
                .toList();
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        employee.setPassword(encodeIfNecessary(employee.getPassword()));
        Employee saved = employeeRepository.save(employee);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Integer id, @RequestBody Employee updated) {
        return employeeRepository.findById(id)
                .map(existing -> {
                    updated.setEmployeeId(existing.getEmployeeId());
                    if (!StringUtils.hasText(updated.getPassword())) {
                        updated.setPassword(existing.getPassword());
                    } else {
                        updated.setPassword(encodeIfNecessary(updated.getPassword()));
                    }
                    Employee saved = employeeRepository.save(updated);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Integer id) {
        if (!employeeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        employeeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        if (!StringUtils.hasText(request.getEmail())
                || !StringUtils.hasText(request.getCurrentPassword())
                || !StringUtils.hasText(request.getNewPassword())) {
            return ResponseEntity.badRequest().body("Email, current password, and new password are required.");
        }

        Optional<Employee> employeeOpt = employeeRepository.findByEmailIdAndActiveTrue(request.getEmail());
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found.");
        }

        Employee employee = employeeOpt.get();
        if (!passwordMatches(request.getCurrentPassword(), employee.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Current password is incorrect.");
        }

        employee.setPassword(passwordEncoder.encode(request.getNewPassword()));
        employeeRepository.save(employee);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<?> requestPasswordReset(
            @RequestBody PasswordResetRequest request,
            HttpServletRequest httpRequest) {
        System.out.println("[PasswordReset] ===== Password reset request received =====");
        System.out.println("[PasswordReset] Email: " + request.getEmail());
        
        String tenantId = httpRequest.getHeader("X-Tenant");
        System.out.println("[PasswordReset] Tenant from header: " + tenantId);
        
        if (!StringUtils.hasText(request.getEmail())) {
            System.out.println("[PasswordReset] ❌ Email is empty");
            return ResponseEntity.badRequest().body("Email is required.");
        }

        if (tenantId == null || tenantId.isBlank()) {
            System.out.println("[PasswordReset] ❌ Missing X-Tenant header");
            return ResponseEntity.badRequest().body("Missing X-Tenant header.");
        }

        // Set up tenant datasource (same as login endpoint)
        try {
            System.out.println("[PasswordReset] Getting client for tenant: " + tenantId);
            com.aibi.neerp.client.dto.Client client = clientService.getClientByDomain(tenantId);
            
            if (client == null) {
                System.out.println("[PasswordReset] ❌ Tenant not found: " + tenantId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tenant not found.");
            }

            if (!Boolean.TRUE.equals(client.getIsActive())) {
                System.out.println("[PasswordReset] ❌ Tenant is inactive: " + tenantId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tenant is inactive.");
            }

            System.out.println("[PasswordReset] Setting up tenant datasource for: " + tenantId);
            TenantContext.setTenantId(tenantId);
            dataSourceConfig.removeDataSource(tenantId);
            dataSourceConfig.addDataSource(tenantId, client);
            System.out.println("[PasswordReset] Tenant datasource set up. Current TenantContext: " + TenantContext.getTenantId());
        } catch (Exception e) {
            System.err.println("[PasswordReset] ❌ Error setting up tenant datasource: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to set up tenant datasource: " + e.getMessage());
        }

        System.out.println("[PasswordReset] Calling passwordResetService.requestReset()...");
        PasswordResetService.ResetStatus status = passwordResetService.requestReset(request.getEmail());
        
        System.out.println("[PasswordReset] ResetStatus: " + status);
        
        if (status == PasswordResetService.ResetStatus.NOT_FOUND) {
            System.out.println("[PasswordReset] ❌ Employee not found for email: " + request.getEmail());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found.");
        }
        if (status == PasswordResetService.ResetStatus.FAILED) {
            System.out.println("[PasswordReset] ❌ Failed to send OTP email");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send OTP email. Please try again later.");
        }
        System.out.println("[PasswordReset] ✅ OTP sent successfully");
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/password-reset/request/internal")
    public ResponseEntity<?> requestPasswordResetInternal(
            @RequestHeader(value = "X-RESET-SECRET", required = false) String providedSecret,
            @RequestBody PasswordResetRequest request) {

        if (!StringUtils.hasText(internalResetSecret)) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                    .body("Internal reset secret is not configured on the server.");
        }

        if (!internalResetSecret.equals(providedSecret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid reset secret.");
        }

        if (!StringUtils.hasText(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email is required.");
        }

        Optional<String> otpOpt = passwordResetService.requestResetInternal(request.getEmail());
        if (otpOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found.");
        }

        return ResponseEntity.ok(Map.of(
                "otp", otpOpt.get(),
                "expiresInMinutes", 10
        ));
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<?> confirmPasswordReset(@RequestBody PasswordResetConfirmRequest request) {
        if (!StringUtils.hasText(request.getEmail())
                || !StringUtils.hasText(request.getOtp())
                || !StringUtils.hasText(request.getNewPassword())) {
            return ResponseEntity.badRequest().body("Email, OTP, and new password are required.");
        }

        boolean success = passwordResetService.resetPasswordWithOtp(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );
        if (!success) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP.");
        }
        return ResponseEntity.noContent().build();
    }

    private String encodeIfNecessary(String candidate) {
        if (!StringUtils.hasText(candidate)) {
            return candidate;
        }
        if (isBcrypt(candidate)) {
            return candidate;
        }
        return passwordEncoder.encode(candidate);
    }

    private boolean passwordMatches(String rawPassword, String storedPassword) {
        if (!StringUtils.hasText(storedPassword)) {
            return false;
        }
        if (passwordEncoder.matches(rawPassword, storedPassword)) {
            return true;
        }
        return storedPassword.equals(rawPassword);
    }

    private boolean isBcrypt(String value) {
        return value != null && (value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$"));
    }
}
