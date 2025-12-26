package com.aibi.neerp.modernization.service;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aibi.neerp.modernization.entity.Modernization;
import com.aibi.neerp.modernization.repository.ModernizationRepository;
import com.aibi.neerp.util.EmailService;

import java.io.IOException;

@Service
@Slf4j
public class ModernizationQuotationEmailService {

    @Autowired
    private ModernizationRepository modernizationRepository;

    @Autowired
    private EmailService emailService;

    public void sendModernizationQuotationEmail(
            MultipartFile pdfFile,
            Integer modernizationQuotationId
    ) throws MessagingException, IOException {

        if (modernizationQuotationId == null) {
            throw new IllegalArgumentException("Modernization quotation ID must be provided.");
        }

        Modernization quotation = modernizationRepository
                .findById(modernizationQuotationId)
                .orElseThrow(() ->
                        new RuntimeException("Modernization Quotation not found"));

        String toEmail = quotation.getLead().getEmailId();

        if (toEmail == null || toEmail.isBlank()) {
            throw new RuntimeException("Recipient email address not found.");
        }

        String subject = "Modernization Quotation - NEERP System";

        String body =
                "Dear Customer,\n\n" +
                "Greetings from NEERP.\n\n" +
                "Please find attached the Modernization Quotation for your reference.\n\n" +
                "If you have any questions or require further clarification, " +
                "please feel free to contact us.\n\n" +
                "Thank you for choosing NEERP.\n\n" +
                "Warm Regards,\n" +
                "NEERP Team\n" +
                "System Generated Email";

        log.info("Sending Modernization Quotation email to {}", toEmail);

        emailService.sendEmailWithAttachment(
                pdfFile,
                toEmail,
                subject,
                body
        );

        log.info("Modernization quotation email sent successfully to {}", toEmail);
    }
}
