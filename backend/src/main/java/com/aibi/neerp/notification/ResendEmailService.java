package com.aibi.neerp.notification;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResendEmailService {

    private static final String RESEND_ENDPOINT = "https://api.resend.com/emails";

    @Value("${resend.api.key:}")
    private String apiKey;

    @Value("${resend.from.email:noreply@email.aibistreet.com}")
    private String fromEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public boolean sendOtpEmail(String toEmail, String otpCode, long minutesValid) {
        if (apiKey == null || apiKey.isBlank()) {
            System.err.println("[ResendEmailService] Resend API key missing; skipping email send.");
            return false;
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("from", fromEmail);
        payload.put("to", List.of(toEmail));
        payload.put("subject", "Your password reset code");

        String textBody = """
                Hi,

                Use the following One Time Password to reset your account password:

                OTP: %s

                This code is valid for %d minutes. Do not share it with anyone.

                If you did not request a password reset, you can safely ignore this email.

                Regards,
                Neerp Support
                """.formatted(otpCode, minutesValid);

        payload.put("text", textBody);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(RESEND_ENDPOINT, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                return true;
            }
            System.err.println("[ResendEmailService] Failed to send email. Status: " + response.getStatusCode());
        } catch (Exception ex) {
            System.err.println("[ResendEmailService] Error sending email: " + ex.getMessage());
        }
        return false;
    }
}

