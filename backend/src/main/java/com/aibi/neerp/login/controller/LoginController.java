package com.aibi.neerp.login.controller;

import com.aibi.neerp.client.service.ClientService;
import com.aibi.neerp.config.DataSourceConfig;
import com.aibi.neerp.config.TenantContext;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.exception.CustomSubscriptionException;
import com.aibi.neerp.client.dto.ClientWithModulesResponse;
import com.aibi.neerp.login.dto.LoginRequest;
import com.aibi.neerp.client.dto.Client;
import com.aibi.neerp.user.service.UserService;
import com.aibi.neerp.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.fasterxml.jackson.core.type.TypeReference;

@Slf4j
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest,
            HttpServletResponse response) {
        System.out.println("client------//////------->" + httpRequest);

        // ✅ Step 1: Get tenant from header
        String domainNm = httpRequest.getHeader("X-Tenant");
        if (domainNm == null || domainNm.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Missing X-Tenant header"));
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

        System.out.println("======domainNm to get modules by domain=====>" + domainNm);
        ClientWithModulesResponse clientResp;
        try {
            clientResp = clientService.getClientWithModulesByDomain(domainNm);
            System.out.println("======domainNm to get modules by domain=====>" + clientResp);
        } catch (CustomSubscriptionException ex) {
            // Parse the message back to Map
            try {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> errorMap = mapper.readValue(ex.getMessage(), new TypeReference<>() {
                });
                return ResponseEntity.status(ex.getStatusCode()).body(errorMap);
            } catch (Exception parsingError) {
                return ResponseEntity.status(ex.getStatusCode()).body(Map.of(
                        "error", "Subscription error",
                        "status", ex.getStatusCode()));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Internal server error while validating tenant",
                    "details", ex.getMessage()));
        }

        if (clientResp == null || clientResp.getClient() == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Tenant not found in database",
                    "status", 401));
        }

        if (!Boolean.TRUE.equals(clientResp.getClient().getIsActive())) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Tenant is inactive. Please contact support.",
                    "status", 401));
        }

        Client client = clientResp.getClient();
        List<String> allowedModules = clientResp.getModules();
        System.out.println("allowedModules=============>" + allowedModules);

        // ✅ Step 3: Set context and register tenant datasource
        TenantContext.setTenantId(domainNm);
        dataSourceConfig.removeDataSource(domainNm);
        dataSourceConfig.addDataSource(domainNm, client);

        // ✅ Step 4: Validate user
        // Optional<User> userOpt = userService.validateUser(request.getEmail(),
        // request.getPassword());
        Optional<Employee> userOpt = userService.validateUser(request.getEmail(), request.getPassword());
        if (userOpt.isEmpty()) {
            TenantContext.clear(); // Cleanup
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Invalid credentials",
                    "status", 401));
        }

        // User user = userOpt.get();
        Employee user = userOpt.get();

        // ✅ Set loginFlag = true and save
        userService.updateLoginFlag(Long.valueOf(user.getEmployeeId()), true);

        log.info("User {} logged in for tenant {}", user.getEmailId(), domainNm);

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

                    // ✅ Set loginFlag = false
                    userService.updateLoginFlag(userId, false);

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
