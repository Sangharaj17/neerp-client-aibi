package com.aibi.neerp.login.controller;

import com.aibi.neerp.login.service.CaptchaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/captcha")
public class CaptchaController {

    @Autowired
    private CaptchaService captchaService;

    /**
     * Generate a new captcha
     * Returns: { sessionId: "xxx", captchaCode: "ABC123" }
     */
    @GetMapping("/generate")
    public ResponseEntity<?> generateCaptcha() {
        Map<String, String> captchaData = captchaService.generateCaptcha();
        return ResponseEntity.ok(captchaData);
    }

    /**
     * Validate captcha (optional standalone endpoint)
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateCaptcha(@RequestBody Map<String, String> request) {
        String sessionId = request.get("sessionId");
        String userInput = request.get("captchaInput");

        boolean isValid = captchaService.validateCaptcha(sessionId, userInput);

        if (isValid) {
            return ResponseEntity.ok(Map.of("valid", true));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "error", "Invalid or expired captcha"));
        }
    }
}
