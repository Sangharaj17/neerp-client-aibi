package com.aibi.neerp.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${resend.from.email}")
    private String fromEmail;

    public void sendEmailWithAttachment(MultipartFile file , String toEmail , String subject , String body) throws MessagingException, IOException {
        
        log.info("Sending hardcoded email to: {}", toEmail);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body);

            if (file != null && !file.isEmpty()) {
                String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf";
                log.debug("Attaching file: {}", fileName);
                helper.addAttachment(fileName, file);
            }

            mailSender.send(message);
            log.info("Hardcoded email sent successfully to {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send hardcoded email: {}", e.getMessage());
            throw e;
        }
    }
}
