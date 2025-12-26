package com.aibi.neerp.modernization.controller;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.aibi.neerp.modernization.service.ModernizationQuotationEmailService;

import java.io.IOException;

@RestController
@RequestMapping("/api/modernization/quotation")
@Slf4j
public class ModernizationQuotationEmailController {

    @Autowired
    private ModernizationQuotationEmailService modernizationQuotationEmailService;

    @PostMapping(value = "/email", consumes = "multipart/form-data")
    public ResponseEntity<?> sendModernizationQuotationEmail(
            @RequestPart("file") MultipartFile file,
            @RequestParam("modernizationQuotationId") Integer modernizationQuotationId
    ) {
        try {
            modernizationQuotationEmailService.sendModernizationQuotationEmail(
                    file,
                    modernizationQuotationId
            );

            return ResponseEntity.ok(
                    "Modernization quotation email sent successfully."
            );

        } catch (MessagingException | IOException e) {
            log.error("Error while sending modernization quotation email", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send modernization quotation email.");

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}
