package com.aibi.neerp.login.service;

import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CaptchaService {

    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    private static final int CODE_LENGTH = 6;
    private static final long EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

    private final SecureRandom random = new SecureRandom();

    // Store captcha codes with their session IDs and expiry times
    private final Map<String, CaptchaData> captchaStore = new ConcurrentHashMap<>();

    public record CaptchaData(String code, long expiryTime) {
    }

    /**
     * Generate a new captcha code and return it with a session ID
     */
    public Map<String, String> generateCaptcha() {
        // Generate session ID
        String sessionId = generateRandomString(32);

        // Generate captcha code
        String code = generateRandomString(CODE_LENGTH);

        // Store with expiry
        captchaStore.put(sessionId, new CaptchaData(code, System.currentTimeMillis() + EXPIRY_MS));

        // Clean up expired entries periodically
        cleanupExpired();

        return Map.of(
                "sessionId", sessionId,
                "captchaCode", code);
    }

    /**
     * Validate captcha code against stored session
     */
    public boolean validateCaptcha(String sessionId, String userInput) {
        if (sessionId == null || userInput == null) {
            return false;
        }

        CaptchaData data = captchaStore.remove(sessionId); // Remove after use (one-time)

        if (data == null) {
            return false; // Session not found
        }

        if (System.currentTimeMillis() > data.expiryTime()) {
            return false; // Expired
        }

        // Case-insensitive comparison
        return data.code().equalsIgnoreCase(userInput.trim());
    }

    private String generateRandomString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    private void cleanupExpired() {
        long now = System.currentTimeMillis();
        captchaStore.entrySet().removeIf(entry -> entry.getValue().expiryTime() < now);
    }
}
