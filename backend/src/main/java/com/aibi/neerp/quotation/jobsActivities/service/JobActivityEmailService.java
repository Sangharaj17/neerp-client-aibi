package com.aibi.neerp.quotation.jobsActivities.service;

import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityResponseDTO;
import com.aibi.neerp.quotation.jobsActivities.entity.NiJobActivity;
import com.aibi.neerp.settings.dto.CompanySettingDTO;
import com.aibi.neerp.settings.service.CompanySettingService;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@Slf4j
public class JobActivityEmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private CompanySettingService companySettingService;

    @Autowired
    private ActivityPdfGenerator pdfGenerator;

    @Value("${spring.mail.username:noreply@neerp.com}")
    private String fromEmail;

    private static final String COMPANY_REF = "COMPANY_SETTINGS_1";

    /**
     * Send job activity notification email with PDF attachment
     */
    public void sendActivityEmailWithPDF(JobActivityResponseDTO activity, NiJobActivity jobActivity) {
        try {
            // Get company details
//            String companyName = companySettingService.getCompanyName(COMPANY_REF);
//            String companyOwnerName = companySettingService.getCompanyOwnerName(COMPANY_REF);
//            String ownerNumber = companySettingService.getOwnerNumber(COMPANY_REF);
//            String companyMail = companySettingService.getCompanyMail(COMPANY_REF);

            String customerName = jobActivity.getJob().getLead().getSalutations()+" "+jobActivity.getJob().getLead().getCustomerName();
            String customerEmail = jobActivity.getJob().getLead().getEmailId();

            CompanySettingDTO company = companySettingService.getCompanySettingsForMail("COMPANY_SETTINGS_1");

            String companyName = (company == null ? "COMPANY" : company.getCompanyName());
            String companyOwnerName = (company == null ? "COMPANY OWNER NAME" : company.getCompanyOwnerName());
            String ownerNumber = (company == null ? "COMPANY OWNER NUMBER" : company.getOwnerNumber());
            String companyMail = (company == null ? "COMPANY MAIL" : company.getCompanyMail());
//            String companyMail = fromEmail;

            // Set defaults if null
//            if (companyName == null) companyName = "COMPANY";
//            if (companyOwnerName == null) companyOwnerName = "Owner";
//            if (ownerNumber == null) ownerNumber = "N/A";
//            if (companyMail == null) companyMail = fromEmail;

//            String customerEmail = ;
//            String customerName = ;

            // Generate PDF
            byte[] pdfBytes = pdfGenerator.generateActivityPDF(activity, jobActivity, companyName);

            // Create email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(companyMail, companyName);
            log.info("From mail:{}",companyMail);
            helper.setTo(customerEmail);
            helper.setReplyTo(companyMail);
            helper.setSubject("Activity Detail at your site.");

            // Build email body matching PHP template
            String htmlContent = buildEmailContent(activity, customerName, companyName,
                    companyOwnerName, ownerNumber, companyMail);
            helper.setText(htmlContent, true);

            // Attach PDF
            String pdfFileName = String.format("Activity_%s_%s.pdf",
                    activity.getJobNumber(),
                    activity.getActivityDate().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
            helper.addAttachment(pdfFileName, new ByteArrayResource(pdfBytes));

            // Send email
            mailSender.send(message);
            log.info("Email sent successfully for activity: {} to: {}",
                    activity.getJobActivityId(), customerEmail);

        } catch (Exception e) {
            log.error("Failed to send email for activity: {}",
                    activity.getJobActivityId(), e);
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }

//    public void sendActivityEmailWithPDF(JobActivityResponseDTO activity, String customerEmail, String customerName) {
//        try {
//            // Get company details
//            String companyName = companySettingService.getCompanyName(COMPANY_REF);
//            String companyOwnerName = companySettingService.getCompanyOwnerName(COMPANY_REF);
//            String ownerNumber = companySettingService.getOwnerNumber(COMPANY_REF);
//            String companyMail = companySettingService.getCompanyMail(COMPANY_REF);
//
//            // Set defaults if null
//            if (companyName == null) companyName = "COMPANY";
//            if (companyOwnerName == null) companyOwnerName = "Owner";
//            if (ownerNumber == null) ownerNumber = "N/A";
//            if (companyMail == null) companyMail = fromEmail;
//
//            // Generate PDF
//            byte[] pdfBytes = pdfGenerator.generateActivityPDF(activity);
//
//            // Create email
//            MimeMessage message = mailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
//
//            helper.setFrom(companyMail, companyName);
//            helper.setTo(customerEmail);
//            helper.setReplyTo(companyMail);
//            helper.setSubject("Activity Detail at your site.");
//
//            // Build email body matching PHP template
//            String htmlContent = buildEmailContent(activity, customerName, companyName,
//                                                  companyOwnerName, ownerNumber, companyMail);
//            helper.setText(htmlContent, true);
//
//            // Attach PDF
//            String pdfFileName = String.format("Activity_%s_%s.pdf",
//                activity.getJobNumber(),
//                activity.getActivityDate().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
//            helper.addAttachment(pdfFileName, new ByteArrayResource(pdfBytes));
//
//            // Send email
//            mailSender.send(message);
//            log.info("Email sent successfully for activity: {} to: {}",
//                    activity.getJobActivityId(), customerEmail);
//
//        } catch (Exception e) {
//            log.error("Failed to send email for activity: {}",
//                    activity.getJobActivityId(), e);
//            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
//        }
//    }

    private String buildEmailContent(JobActivityResponseDTO activity, String customerName,
                                     String companyName, String companyOwnerName, 
                                     String ownerNumber, String companyMail) {
        
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        String activityDate = activity.getActivityDate() != null ? 
            activity.getActivityDate().format(dateFormatter) : "N/A";

        // Build mail body matching PHP template
        StringBuilder mailBody = new StringBuilder();
        mailBody.append(companyName).append(" Do some work for your site dated :<b style='color:green;'>")
                .append(activityDate).append("</b>.<br><br>Detail of This Activity as Follows :<br>");
        
        mailBody.append("Activity Date : <b style='color:green;'>").append(activityDate).append("</b>.<br>");
        mailBody.append("Activity By : <b style='color:green;'>")
                .append(activity.getJobActivityByName() != null ? activity.getJobActivityByName() : "N/A")
                .append("</b>.<br>");
        mailBody.append("Activity Type : <b style='color:green;'>")
                .append(activity.getJobActivityTypeName() != null ? activity.getJobActivityTypeName() : "N/A")
                .append("</b>.<br>");
        mailBody.append("Activity Title  : <b style='color:green;'>")
                .append(activity.getActivityTitle() != null ? activity.getActivityTitle() : "N/A")
                .append("</b>.<br>");
        mailBody.append("Activity Description  : <b style='color:green;'>")
                .append(activity.getActivityDescription() != null ? activity.getActivityDescription() : "N/A")
                .append("</b>.<br>");
        mailBody.append("Activity Remark  : <b style='color:green;'>")
                .append(activity.getRemark() != null ? activity.getRemark() : "N/A")
                .append("</b>.<br>");

        // Build complete HTML message
        StringBuilder message = new StringBuilder();
        message.append("<html><body>");
        message.append("<br>");
        message.append("<b>Dear ").append(customerName).append(", </b>.");
        message.append("<br><br>");
        message.append("<b>").append(mailBody.toString()).append(" </b>");
        message.append("<br><br>");
        message.append("<p style='font-size:16px; color:blue ;'>IF ANY QUERY OR DIFFICULTY IN THIS EMAIL SO FEEL FREE TO CONTACT US</p><br><br>");
        message.append("<p style='font-size:16px; color:blue ;'>Best Regards,</p>");
        message.append("<b style='font-size:16px;'>").append(companyOwnerName).append("</b><br>");
        message.append("<b style='font-size:16px;'>").append(companyName).append(".</b><br>");
        message.append("<b style='font-size:16px;'>M-").append(ownerNumber).append("</b><br>");
        message.append("<br>");
        message.append("</body></html>");

        return message.toString();
    }
}
