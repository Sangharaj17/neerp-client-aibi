package com.aibi.neerp.amc.quatation.pdf.service;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aibi.neerp.amc.quatation.initial.entity.AmcQuotation;
import com.aibi.neerp.amc.quatation.initial.entity.RevisedAmcQuotation;
import com.aibi.neerp.amc.quatation.initial.repository.AmcQuotationRepository;
import com.aibi.neerp.amc.quatation.initial.repository.RevisedAmcQuotationRepository;
import com.aibi.neerp.amc.quatation.renewal.entity.AmcRenewalQuotation;
import com.aibi.neerp.amc.quatation.renewal.entity.RevisedRenewalAmcQuotation;
import com.aibi.neerp.amc.quatation.renewal.repository.AmcRenewalQuotationRepository;
import com.aibi.neerp.amc.quatation.renewal.repository.RevisedRenewalAmcQuotationRepository;
import com.aibi.neerp.util.EmailService;

import java.io.IOException;

@Service
@Slf4j
public class AmcQuotationEmailService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private AmcQuotationRepository amcQuotationRepository;

    @Autowired
    private RevisedAmcQuotationRepository revisedAmcQuotationRepository;

    @Autowired
    private AmcRenewalQuotationRepository amcRenewalQuotationRepository;

    @Autowired
    private RevisedRenewalAmcQuotationRepository revisedRenewalAmcQuotationRepository;

    public void sendEmailWithAttachment(
            MultipartFile file,
            Integer amcQuotationId,
            Integer revisedAmcQuotationId,
            Integer renewalQuotationId,
            Integer revisedRenewalQuotationId
    ) throws MessagingException, IOException {

        // ✅ Validate only ONE ID is provided
        int count =
                (amcQuotationId != null ? 1 : 0) +
                (revisedAmcQuotationId != null ? 1 : 0) +
                (renewalQuotationId != null ? 1 : 0) +
                (revisedRenewalQuotationId != null ? 1 : 0);

        if (count != 1) {
            throw new IllegalArgumentException("Exactly one quotation ID must be provided.");
        }

        String toEmail;
        String quotationType;

        if (amcQuotationId != null) {
            AmcQuotation quotation = amcQuotationRepository.findById(amcQuotationId)
                    .orElseThrow(() -> new RuntimeException("AMC Quotation not found"));
            toEmail = quotation.getLead().getEmailId();
            quotationType = "AMC Quotation";

        } else if (revisedAmcQuotationId != null) {
            RevisedAmcQuotation quotation = revisedAmcQuotationRepository.findById(revisedAmcQuotationId)
                    .orElseThrow(() -> new RuntimeException("Revised AMC Quotation not found"));
            toEmail = quotation.getLead().getEmailId();
            quotationType = "Revised AMC Quotation";

        } else if (renewalQuotationId != null) {
            AmcRenewalQuotation quotation = amcRenewalQuotationRepository.findById(renewalQuotationId)
                    .orElseThrow(() -> new RuntimeException("AMC Renewal Quotation not found"));
            toEmail = quotation.getLead().getEmailId();
            quotationType = "AMC Renewal Quotation";

        } else {
            RevisedRenewalAmcQuotation quotation = revisedRenewalAmcQuotationRepository
                    .findById(revisedRenewalQuotationId)
                    .orElseThrow(() -> new RuntimeException("Revised AMC Renewal Quotation not found"));
            toEmail = quotation.getLead().getEmailId();
            quotationType = "Revised AMC Renewal Quotation";
        }

        if (toEmail == null || toEmail.isBlank()) {
            throw new RuntimeException("Recipient email address not found.");
        }

        // ✅ Improved Subject & Body
        String subject = quotationType + " - NEERP System";
        String body =
                "Dear Customer,\n\n" +
                "Greetings from NEERP.\n\n" +
                "Please find attached the " + quotationType + " for your reference.\n\n" +
                "If you have any questions or require further clarification, " +
                "please feel free to contact us.\n\n" +
                "Thank you for choosing NEERP.\n\n" +
                "Warm Regards,\n" +
                "NEERP Team\n" +
                "System Generated Email";

        log.info("Sending {} email to {}", quotationType, toEmail);

        emailService.sendEmailWithAttachment(file, toEmail, subject, body);

        log.info("Email sent successfully to {}", toEmail);
    }
}
