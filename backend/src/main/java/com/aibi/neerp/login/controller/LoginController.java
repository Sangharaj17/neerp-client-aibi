package com.aibi.neerp.login.controller;

import com.aibi.neerp.client.service.ClientService;
import com.aibi.neerp.config.DataSourceConfig;
import com.aibi.neerp.config.TenantContext;
import com.aibi.neerp.config.TenantSchemaInitializer;
import com.aibi.neerp.client.dto.Client;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.login.dto.LoginRequest;
import com.aibi.neerp.user.service.UserService;
import com.aibi.neerp.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

// @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class LoginController {
    @Autowired
    private ClientService clientService;
    // @Autowired private DynamicDataSourceManager dsManager;
    @Autowired
    private UserService userService;
    @Autowired
    private DataSourceConfig dataSourceConfig;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    private TenantSchemaInitializer tenantSchemaInitializer;
    
    @Autowired
    private com.aibi.neerp.config.InitializationStatusTracker statusTracker;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest,
            HttpServletResponse response) {
        System.out.println("Login request received");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Password: " + (request.getPassword() != null ? "***" : "null"));

        // ✅ Step 1: Get tenant from header
        String domainNm = httpRequest.getHeader("X-Tenant");
        if (domainNm == null || domainNm.isBlank()) {
            System.out.println("Missing X-Tenant header");
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Missing X-Tenant header"));
        }

        // Validate request fields
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            System.out.println("Email is missing or blank");
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Email is required"));
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            System.out.println("Password is missing or blank");
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Password is required"));
        }

        // System.out.println("client----domainNm--------->" + domainNm);
        System.out.println("Processing login for tenant: " + domainNm);
        // ✅ Step 2: Get tenant info
        // Client client = clientService.getClientByDomain(clientId);
        // if (client == null || !client.getIsActive()) {
        // return ResponseEntity.status(401).body(Map.of(
        // "error", "Tenant not found or inactive",
        // "status", 401
        // ));
        // }

        // For login we only need DB credentials; call the simple domain endpoint
        System.out.println("======domainNm to get client by domain=====>" + domainNm);
        Client client;
        try {
            client = clientService.getClientByDomain(domainNm);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Internal server error while fetching tenant",
                    "details", ex.getMessage()));
        }

        if (client == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Tenant not found in database",
                    "status", 401));
        }

        if (!Boolean.TRUE.equals(client.getIsActive())) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Tenant is inactive. Please contact support.",
                    "status", 401));
        }

        // ✅ Step 3: Set context and register tenant datasource
        System.out.println("[Login] Step 3: Setting tenant context and datasource for: " + domainNm);
        TenantContext.setTenantId(domainNm);
        System.out.println("[Login] Tenant context set to: " + TenantContext.getTenantId());
        
        dataSourceConfig.removeDataSource(domainNm);
        System.out.println("[Login] Removed existing datasource (if any) for: " + domainNm);
        
        dataSourceConfig.addDataSource(domainNm, client);
        System.out.println("[Login] Added datasource for tenant: " + domainNm + " with DB URL: " + client.getDbUrl());

        // ✅ Check if schema initialization is needed
        // This will handle both first-time setup and incremental updates
        System.out.println("[Login] Checking if schema is initialized...");
        boolean needsFullInit = !tenantSchemaInitializer.isInitialized();
        System.out.println("[Login] Schema initialization needed: " + needsFullInit);
        
        if (needsFullInit) {
            // First-time setup: Run initialization in a separate thread to avoid blocking
            final String tenantIdForThread = domainNm; // Capture for thread
            new Thread(() -> {
                try {
                    TenantContext.setTenantId(tenantIdForThread);
                    tenantSchemaInitializer.initializeIfRequired(tenantIdForThread);
                } catch (Exception e) {
                    System.err.println("Error during async initialization: " + e.getMessage());
                    e.printStackTrace();
                } finally {
                    TenantContext.clear();
                }
            }).start();
            return ResponseEntity.accepted().body(Map.of(
                    "requiresInitialization", true,
                    "message", "Initializing tenant database. Please wait..."
            ));
        } else {
            // Schema exists: Run data initialization synchronously with timeout
            // This ensures default data is inserted before login proceeds
            System.out.println("[Login] Schema exists, ensuring default data is initialized for tenant: " + domainNm);
            try {
                // Run synchronously - should be fast if data already exists (idempotent checks)
                System.out.println("[Login] Running data initialization synchronously...");
                tenantSchemaInitializer.initializeIfRequired(domainNm);
                System.out.println("[Login] ✅ Data initialization completed for tenant: " + domainNm);
            } catch (Exception e) {
                // Log error but don't block login - data init errors shouldn't prevent login
                System.err.println("[Login] ⚠️ Warning: Error during data initialization for tenant " + domainNm + ": " + e.getMessage());
                System.err.println("[Login] Login will proceed, but default data may be missing. Check logs for details.");
                e.printStackTrace();
                // Continue with login - user can manually trigger data init later if needed
            }
        }

        // ✅ Step 4: Validate user
        System.out.println("[Login] Step 4: Validating user credentials...");
        System.out.println("[Login] Current tenant context: " + TenantContext.getTenantId());
        System.out.println("[Login] Attempting to validate user with email: " + request.getEmail());
        
        Optional<Employee> userOpt = userService.validateUser(request.getEmail(), request.getPassword());
        if (userOpt.isEmpty()) {
            System.err.println("[Login] ❌ User validation failed - invalid credentials for email: " + request.getEmail());
            TenantContext.clear(); // Cleanup
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Invalid credentials",
                    "status", 401));
        }
        
        System.out.println("[Login] ✅ User validation successful");

        // User user = userOpt.get();
        Employee user = userOpt.get();

        // ✅ No users table; skip updating login flag

        System.out.println("User " + user.getEmailId() + " logged in for tenant " + domainNm);

        // ✅ Step 5: Generate token
        String token = jwtUtil.generateToken(Long.valueOf(user.getEmployeeId()), user.getUsername(), domainNm);

        // ✅ Step 6: Cookies (no .domain, secure=false for local dev)
        ResponseCookie tokenCookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false) // .secure(true) When deploying to production
                .sameSite("Lax") // .sameSite("Strict") When deploying to production
                .path("/")
                .maxAge(60 * 60)
                .build();

        // ResponseCookie visibleCookie = ResponseCookie.from("access_token", token)
        // .httpOnly(false)
        // .secure(false)//.secure(true) When deploying to production
        // .sameSite("Lax")//.sameSite("Strict") When deploying to production
        // .path("/")
        // .maxAge(60 * 60)
        // .build();

        // ✅ Step 7: Build response
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, tokenCookie.toString());
        // headers.add(HttpHeaders.SET_COOKIE, visibleCookie.toString());

        return ResponseEntity.ok()
                .headers(headers)
                .body(Map.of(
                        "clientId", client.getId(),
                        "username", user.getUsername(),
                        "message", "Login successful",
                        // "modules", allowedModules,
                        "clientName", client.getClientName(),
                        "userEmail", user.getEmailId(),
                        "token", token));
    }

    @GetMapping("/tenants/init-status")
    public ResponseEntity<?> initStatus(HttpServletRequest httpRequest) {
        String domainNm = httpRequest.getHeader("X-Tenant");
        if (domainNm == null || domainNm.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing X-Tenant header"));
        }
        TenantContext.setTenantId(domainNm);
        boolean schemaInitialized = tenantSchemaInitializer.isInitialized();
        
        // Get detailed status if available
        com.aibi.neerp.config.InitializationStatusTracker.StatusInfo status = statusTracker.getStatus(domainNm);
        if (status != null) {
            // If schema is initialized and status shows completed, return initialized=true
            // Also, if schema is initialized but no status completion yet, assume it's in progress
            boolean isInitialized = (schemaInitialized && status.isCompleted()) || 
                                   (schemaInitialized && status.getProgress() == 100);
            
            System.out.println("[InitStatus] Tenant: " + domainNm + 
                             ", SchemaInitialized: " + schemaInitialized + 
                             ", StatusCompleted: " + (status != null ? status.isCompleted() : "null") +
                             ", Progress: " + (status != null ? status.getProgress() : "null") +
                             ", ReturningInitialized: " + isInitialized);
            
            return ResponseEntity.ok(Map.of(
                "initialized", isInitialized,
                "currentStep", status.getCurrentStep(),
                "progress", status.getProgress(),
                "message", status.getMessage()
            ));
        }
        
        // If no status but schema is initialized, assume it's ready
        boolean isInitialized = schemaInitialized;
        System.out.println("[InitStatus] Tenant: " + domainNm + 
                         ", SchemaInitialized: " + schemaInitialized + 
                         ", NoStatusInfo, ReturningInitialized: " + isInitialized);
        
        return ResponseEntity.ok(Map.of("initialized", isInitialized));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response,
            @CookieValue(value = "token", required = false) String token) {
        String domainNm = null;
        // ✅ Step 1: Cleanup tenant-specific DataSource
        if (token != null) {
            try {
                Claims claims = jwtUtil.validateToken(token);
                domainNm = claims.get("domain", String.class);
                Long userId = claims.get("userId", Long.class);

                // ✅ Set context and restore DataSource
                if (domainNm != null) {
                    TenantContext.setTenantId(domainNm);

                    // ✅ Restore DataSource before DB ops
                    Client client = clientService.getClientByDomain(domainNm);
                    if (client != null) {
                        dataSourceConfig.addDataSource(domainNm, client);
                    }

                    // ✅ No users table; skip updating login flag on logout

                    // ✅ Clean up tenant DB
                    dataSourceConfig.removeDataSource(domainNm);
                }

            } catch (Exception e) {
                System.err.println("❌ Logout error: " + e.getMessage());
                // If token invalid, still allow logout
            }
        }

        // ✅ Final cleanup: remove any remaining context
        // String tenantId = TenantContext.getTenantId();
        if (domainNm != null) {
            dataSourceConfig.removeDataSource(domainNm); // just in case
        }

        // ✅ Step 2: Clear context
        // 🧹 Clear the TenantContext so no tenant info leaks to other users/threads
        TenantContext.clear();

        // ✅ Step 3: Expire cookies
        ResponseCookie expiredToken = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false) // ✅ set true in production (HTTPS)
                .sameSite("Lax")
                .path("/")
                .maxAge(0) // expire immediately
                .build();

        // ResponseCookie expiredAccessToken = ResponseCookie.from("access_token", "")
        // .httpOnly(false)
        // .secure(false)
        // .sameSite("Lax")
        // .path("/")
        // .maxAge(0)
        // .build();

        response.addHeader(HttpHeaders.SET_COOKIE, expiredToken.toString());
        // response.addHeader(HttpHeaders.SET_COOKIE, expiredAccessToken.toString());

        return ResponseEntity.ok(Map.of("message", "Successfully logged out"));
    }

    @PostMapping("/tenants/init-data")
    public ResponseEntity<?> initializeDefaultData(HttpServletRequest httpRequest) {
        String domainNm = httpRequest.getHeader("X-Tenant");
        if (domainNm == null || domainNm.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing X-Tenant header"));
        }
        
        try {
            TenantContext.setTenantId(domainNm);
            System.out.println("[InitData] Manually triggering data initialization for tenant: " + domainNm);
            
            // Get client to ensure DataSource is set up
            Client client = clientService.getClientByDomain(domainNm);
            if (client == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Tenant not found"));
            }
            
            // Ensure DataSource is set up
            dataSourceConfig.removeDataSource(domainNm);
            dataSourceConfig.addDataSource(domainNm, client);
            
            // Run initialization
            tenantSchemaInitializer.initializeIfRequired(domainNm);
            
            return ResponseEntity.ok(Map.of(
                "message", "Default data initialization completed successfully",
                "tenant", domainNm
            ));
        } catch (Exception e) {
            System.err.println("[InitData] Error during manual data initialization: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to initialize default data",
                "details", e.getMessage()
            ));
        } finally {
            TenantContext.clear();
        }
    }

    // @PostMapping("/force-login")
    // public ResponseEntity<?> forceLogin(@RequestBody LoginRequest request,
    // HttpServletRequest httpRequest, HttpServletResponse response) {
    // String tenantId = httpRequest.getHeader("X-Tenant");
    // if (tenantId == null || tenantId.isBlank()) {
    // return ResponseEntity.badRequest().body(Map.of("error", "Missing X-Tenant
    // header"));
    // }
    //
    // Client client = clientService.getClientByDomain(tenantId);
    // if (client == null || !client.getIsActive()) {
    // return ResponseEntity.status(401).body(Map.of("error", "Invalid tenant"));
    // }
    //
    // TenantContext.setTenantId(tenantId);
    // dataSourceConfig.removeDataSource(tenantId);
    // dataSourceConfig.addDataSource(tenantId, client);
    //
    // //Optional<User> userOpt = userService.validateUser(request.getEmail(),
    // request.getPassword());
    // Optional<Employee> userOpt = userService.validateUser(request.getEmail(),
    // request.getPassword());
    // if (userOpt.isEmpty()) {
    // TenantContext.clear();
    // return ResponseEntity.status(401).body(Map.of("error", "Invalid
    // credentials"));
    // }
    //
    // User user = userOpt.get();
    //
    // // 🚨 Force login even if already logged in
    // //user.setLoginFlag(true);
    // //userService.save(user);
    //
    // // ✅ Set loginFlag = false
    // userService.updateLoginFlag(user.getId(), true);
    //
    // String token = jwtUtil.generateToken(user.getId(), user.getUsername(),
    // tenantId);
    //
    // ResponseCookie tokenCookie = ResponseCookie.from("token", token)
    // .httpOnly(true).secure(false).sameSite("Lax").path("/").maxAge(3600).build();
    // ResponseCookie visibleCookie = ResponseCookie.from("access_token", token)
    // .httpOnly(false).secure(false).sameSite("Lax").path("/").maxAge(3600).build();
    //
    // HttpHeaders headers = new HttpHeaders();
    // headers.add(HttpHeaders.SET_COOKIE, tokenCookie.toString());
    // headers.add(HttpHeaders.SET_COOKIE, visibleCookie.toString());
    //
    // return ResponseEntity.ok().headers(headers).body(Map.of(
    // "username", user.getUsername(),
    // "message", "Force login successful"
    // ));
    // }
    //

}
