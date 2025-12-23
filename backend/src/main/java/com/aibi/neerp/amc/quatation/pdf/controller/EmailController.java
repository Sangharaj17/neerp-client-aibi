package com.aibi.neerp.amc.quatation.pdf.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.aibi.neerp.amc.quatation.pdf.service.EmailService;

@RestController
@RequestMapping("/api/amc/quotation/mail")
@Slf4j
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-pdf")
    public ResponseEntity<String> sendPdfEmail(@RequestParam("file") MultipartFile file) {
        
        log.info("Received request to send PDF via email");

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please upload a valid PDF file.");
        }

        try {
            emailService.sendEmailWithAttachment(file);
            return ResponseEntity.ok("Email sent successfully with the attached file!");
        } catch (Exception e) {
            log.error("Email API failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}