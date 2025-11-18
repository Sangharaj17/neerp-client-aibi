# Multi-Tenant reCAPTCHA Setup Guide

This guide explains how to set up reCAPTCHA for multi-tenant domains.

## Backend Changes Required

### 1. Update Client DTO

Add reCAPTCHA fields to `backend/src/main/java/com/aibi/neerp/client/dto/Client.java`:

```java
package com.aibi.neerp.client.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Client {
    private Long id;
    private String clientName;
    private String domain;
    private String dbUrl;
    private String dbUsername;
    private String dbPassword;
    private Boolean isActive;
    
    // Add these fields for reCAPTCHA
    private String recaptchaSiteKey;    // Public site key (returned to frontend)
    private String recaptchaSecretKey; // Secret key (used for validation, never returned to frontend)

    @Override
    public String toString() {
        return "Client{" +
                "id=" + id +
                ", clientName='" + clientName + '\'' +
                ", domain='" + domain + '\'' +
                ", dbUrl='" + dbUrl + '\'' +
                ", dbUsername='" + dbUsername + '\'' +
                ", dbPassword='" + dbPassword + '\'' +
                ", isActive=" + isActive +
                ", recaptchaSiteKey='" + recaptchaSiteKey + '\'' +
                '}';
    }
}
```

### 2. Update Database Schema

Add columns to your clients table:

```sql
ALTER TABLE clients 
ADD COLUMN recaptcha_site_key VARCHAR(255) NULL,
ADD COLUMN recaptcha_secret_key VARCHAR(255) NULL;
```

### 3. Update ClientService

In `backend/src/main/java/com/aibi/neerp/client/service/ClientService.java`, update the parsing to include reCAPTCHA fields:

```java
if (node.has("recaptchaSiteKey")) c.setRecaptchaSiteKey(node.get("recaptchaSiteKey").asText());
if (node.has("recaptchaSecretKey")) c.setRecaptchaSecretKey(node.get("recaptchaSecretKey").asText());
```

### 4. Update LoginRequest DTO

Add reCAPTCHA token to the login request. Find or create `LoginRequest.java`:

```java
package com.aibi.neerp.login.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String email;
    private String password;
    private String recaptchaToken; // Add this field
}
```

### 5. Add reCAPTCHA Validation Service

Create `backend/src/main/java/com/aibi/neerp/login/service/RecaptchaService.java`:

```java
package com.aibi.neerp.login.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Map;

@Service
public class RecaptchaService {
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean verifyRecaptcha(String recaptchaToken, String secretKey) {
        if (recaptchaToken == null || recaptchaToken.isBlank() || secretKey == null || secretKey.isBlank()) {
            return false;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("secret", secretKey);
            params.add("response", recaptchaToken);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(RECAPTCHA_VERIFY_URL, request, Map.class);

            if (response.getBody() != null) {
                Boolean success = (Boolean) response.getBody().get("success");
                return Boolean.TRUE.equals(success);
            }
            return false;
        } catch (Exception e) {
            System.err.println("reCAPTCHA verification error: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
```

### 6. Update LoginController

In `backend/src/main/java/com/aibi/neerp/login/controller/LoginController.java`:

1. **Inject RecaptchaService:**
```java
@Autowired
private RecaptchaService recaptchaService;
```

2. **Add reCAPTCHA validation after getting the client:**
```java
// After getting the client (around line 100-104)
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

// ✅ Validate reCAPTCHA if configured for this tenant
if (client.getRecaptchaSecretKey() != null && !client.getRecaptchaSecretKey().isBlank()) {
    if (request.getRecaptchaToken() == null || request.getRecaptchaToken().isBlank()) {
        return ResponseEntity.badRequest().body(Map.of(
                "error", "reCAPTCHA verification is required"));
    }
    
    boolean isValid = recaptchaService.verifyRecaptcha(
            request.getRecaptchaToken(), 
            client.getRecaptchaSecretKey()
    );
    
    if (!isValid) {
        return ResponseEntity.badRequest().body(Map.of(
                "error", "reCAPTCHA verification failed. Please try again."));
    }
}
```

### 7. Update API Endpoint to Return reCAPTCHA Site Key

Ensure your `/api/clients/domain/{domain}/with-subscription-check` endpoint returns the `recaptchaSiteKey` in the response. The frontend will automatically pick it up.

## Configuration Steps

### For Each Tenant:

1. **Get reCAPTCHA Keys:**
   - Go to https://www.google.com/recaptcha/admin
   - Register a new site for each tenant domain
   - Get the Site Key (public) and Secret Key (private)

2. **Store in Database:**
   - Update the client record in your database with:
     - `recaptcha_site_key`: The public site key
     - `recaptcha_secret_key`: The secret key (never expose this)

3. **Domain Configuration:**
   - When registering reCAPTCHA, add all domains that will use this tenant:
     - `tenant1.example.com`
     - `tenant2.example.com`
     - Or use wildcard if applicable

## Testing

1. Use Google's test keys for development:
   - Site Key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
   - Secret Key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`
   - These always pass validation

2. For production, each tenant needs their own keys registered for their specific domain.

## Notes

- If a tenant doesn't have reCAPTCHA configured (null/empty), the frontend will use a fallback key and validation will be skipped
- Each tenant can have different reCAPTCHA keys configured
- The secret key is never sent to the frontend - only the site key is returned
- reCAPTCHA validation happens server-side for security

