package com.aibi.neerp.amc.quatation.pdf.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.aibi.neerp.amc.quatation.pdf.service.AmcQuotationEmailService;

@RestController
@RequestMapping("/api/amc/quotation/mail")
@Slf4j
public class EmailController {
    
    @Autowired
    private AmcQuotationEmailService emailService;
    
    @PostMapping("/send-pdf")
    public ResponseEntity<String> sendPdfEmail(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) Integer amcQuotationId,
            @RequestParam(required = false) Integer revisedAmcQuotationId,
            @RequestParam(required = false) Integer renewalQuotationId,
            @RequestParam(required = false) Integer revisedRenewalQuotationId
    ) {
    	log.info("Received request to send quotation PDF via email. IDs -> " +
                "amcQuotationId: {}, revisedAmcQuotationId: {}, " +
                "renewalQuotationId: {}, revisedRenewalQuotationId: {}", 
                amcQuotationId, revisedAmcQuotationId, renewalQuotationId, revisedRenewalQuotationId);        
        try {
            emailService.sendEmailWithAttachment(
                    file,
                    amcQuotationId,
                    revisedAmcQuotationId,
                    renewalQuotationId,
                    revisedRenewalQuotationId
            );
            return ResponseEntity.ok("Email sent successfully with the attached PDF.");
            
        } catch (IllegalArgumentException e) {
            log.warn("Validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
            
        } catch (Exception e) {
            log.error("Email sending failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email. Please try again later.");
        }
    }
}