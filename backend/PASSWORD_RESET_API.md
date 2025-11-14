# Password Reset API Implementation Guide

This document outlines the backend API endpoints needed for the magic link password reset flow.

## Required Endpoints

### 1. Check Email Exists (Optional but Recommended)
**POST** `/api/password-reset/check-email`

**Headers:**
- `X-Tenant`: Tenant domain

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "exists": true,
  "message": "Email found"
}
```

**Error Response (404):**
```json
{
  "error": "Email not found in our system"
}
```

**Implementation Notes:**
- Check if email exists in the users/employees table
- Don't reveal if email exists or not (security best practice)
- Always return success to prevent email enumeration
- OR: Return 404 only if you want to prevent password reset for non-existent emails

### 2. Store Reset Token
**POST** `/api/password-reset/store-token`

**Headers:**
- `X-Tenant`: Tenant domain

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "random_32_byte_hex_token",
  "expiresAt": "2024-01-01T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token stored successfully"
}
```

**Implementation Notes:**
- Store the token in `tbl_password_reset_otp` table (or create a new table for magic links)
- Hash the token before storing (use BCrypt or similar)
- Set expiration time (1 hour from creation)
- Invalidate any existing tokens for the same email

### 3. Reset Password (REQUIRED - All validation happens here)
**POST** `/api/password-reset/reset`

**Headers:**
- `X-Tenant`: Tenant domain

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "new_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Responses:**
- `400`: Invalid token or expired
- `400`: Password validation failed
- `404`: Token not found
- `500`: Internal server error

**Implementation Notes (CRITICAL):**
- **MUST validate token exists in database** (check `tbl_password_reset_otp` or similar)
- **MUST verify token is not expired** (check `expires_at` timestamp)
- **MUST verify token is not already used** (check `used` or `invalidated` flag)
- **MUST hash the new password** before storing (use BCrypt or similar)
- **MUST update user password** in the users/employees table
- **MUST invalidate the token** after successful reset (mark as used)
- **MUST validate password strength** (minimum length, complexity if required)
- Consider rate limiting to prevent abuse
- All validation logic must be in Java backend - Next.js only proxies the request

## Database Schema

You can use the existing `tbl_password_reset_otp` table or create a new one:

```sql
CREATE TABLE IF NOT EXISTS tbl_password_reset_token (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_token_hash ON tbl_password_reset_token(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_email ON tbl_password_reset_token(email);
```

## Security Considerations

1. **Token Generation**: Use cryptographically secure random tokens (32+ bytes)
2. **Token Hashing**: Hash tokens before storing (never store plain tokens)
3. **Expiration**: Set reasonable expiration times (1 hour recommended)
4. **Rate Limiting**: Limit password reset requests per email/IP
5. **Token Invalidation**: Mark tokens as used after successful reset
6. **Email Verification**: Verify email exists before sending reset link
7. **Password Strength**: Enforce minimum password requirements

## Example Implementation

### Controller
```java
@RestController
@RequestMapping("/api/password-reset")
public class PasswordResetController {
    
    @Autowired
    private PasswordResetService passwordResetService;
    
    @PostMapping("/store-token")
    public ResponseEntity<?> storeToken(
            @RequestBody PasswordResetRequest request,
            HttpServletRequest httpRequest) {
        String tenant = httpRequest.getHeader("X-Tenant");
        // Implementation
    }
    
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(
            @RequestBody PasswordResetRequest request,
            HttpServletRequest httpRequest) {
        String tenant = httpRequest.getHeader("X-Tenant");
        // Implementation
    }
}
```

## Testing

Test the flow:
1. Request password reset with valid email
2. Verify token is stored in database
3. Use token to reset password
4. Verify token is invalidated after use
5. Verify expired tokens are rejected
6. Verify invalid tokens are rejected

