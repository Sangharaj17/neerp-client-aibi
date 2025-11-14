package com.aibi.neerp.employeemanagement.service;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.entity.PasswordResetOtp;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.employeemanagement.repository.PasswordResetOtpRepository;
import com.aibi.neerp.notification.ResendEmailService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetService {

    private static final int OTP_LENGTH = 6;
    private static final long OTP_EXPIRY_MINUTES = 10L;
    private static final int MAX_ATTEMPTS = 5;

    private final PasswordResetOtpRepository otpRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final ResendEmailService emailService;
    private final SecureRandom random = new SecureRandom();

    public PasswordResetService(PasswordResetOtpRepository otpRepository,
                                EmployeeRepository employeeRepository,
                                PasswordEncoder passwordEncoder,
                                ResendEmailService emailService) {
        this.otpRepository = otpRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public enum ResetStatus {
        NOT_FOUND,
        SENT,
        FAILED
    }

    public ResetStatus requestReset(String email) {
        System.out.println("[PasswordResetService] ===== Starting password reset for email: " + email + " =====");
        System.out.println("[PasswordResetService] Current TenantContext: " + com.aibi.neerp.config.TenantContext.getTenantId());
        
        System.out.println("[PasswordResetService] Searching for employee with email: " + email);
        Optional<Employee> employeeOpt = employeeRepository.findByEmailIdAndActiveTrue(email);
        
        if (employeeOpt.isEmpty()) {
            System.out.println("[PasswordResetService] ❌ Employee not found or not active for email: " + email);
            System.out.println("[PasswordResetService] TenantContext was: " + com.aibi.neerp.config.TenantContext.getTenantId());
            return ResetStatus.NOT_FOUND;
        }
        
        Employee employee = employeeOpt.get();
        System.out.println("[PasswordResetService] ✅ Employee found: " + employee.getEmployeeName() + " (ID: " + employee.getEmployeeId() + ")");
        
        System.out.println("[PasswordResetService] Generating OTP...");
        Optional<String> otpOpt = generateOtp(employee);
        if (otpOpt.isEmpty()) {
            System.out.println("[PasswordResetService] ❌ Failed to generate OTP");
            return ResetStatus.FAILED;
        }
        
        System.out.println("[PasswordResetService] OTP generated successfully");
        
        if (!emailService.isConfigured()) {
            System.err.println("[PasswordResetService] ❌ Resend API key not configured; cannot send email.");
            return ResetStatus.FAILED;
        }
        
        System.out.println("[PasswordResetService] Sending OTP email to: " + email);
        boolean sent = emailService.sendOtpEmail(email, otpOpt.get(), OTP_EXPIRY_MINUTES);
        
        if (sent) {
            System.out.println("[PasswordResetService] ✅ OTP email sent successfully");
        } else {
            System.out.println("[PasswordResetService] ❌ Failed to send OTP email");
        }
        
        return sent ? ResetStatus.SENT : ResetStatus.FAILED;
    }

    public Optional<String> requestResetInternal(String email) {
        return employeeRepository.findByEmailIdAndActiveTrue(email)
                .flatMap(this::generateOtp);
    }

    @Transactional
    public Optional<String> generateOtp(Employee employee) {
        String otp = generateOtpCode();
        PasswordResetOtp resetOtp = otpRepository.findTopByEmailAndInvalidatedFalseOrderByCreatedAtDesc(employee.getEmailId())
                .orElseGet(PasswordResetOtp::new);

        resetOtp.setEmail(employee.getEmailId());
        resetOtp.setCodeHash(passwordEncoder.encode(otp));
        resetOtp.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        resetOtp.setAttempts(0);
        resetOtp.setInvalidated(false);
        resetOtp.setCreatedAt(LocalDateTime.now());

        otpRepository.save(resetOtp);
        return Optional.of(otp);
    }

    @Transactional
    public boolean resetPasswordWithOtp(String email, String otp, String newPassword) {
        if (!StringUtils.hasText(email) || !StringUtils.hasText(otp) || !StringUtils.hasText(newPassword)) {
            return false;
        }

        Optional<Employee> employeeOpt = employeeRepository.findByEmailIdAndActiveTrue(email);
        if (employeeOpt.isEmpty()) {
            return false;
        }
        Employee employee = employeeOpt.get();

        Optional<PasswordResetOtp> otpOpt = otpRepository.findTopByEmailAndInvalidatedFalseOrderByCreatedAtDesc(email);
        if (otpOpt.isEmpty()) {
            return false;
        }

        PasswordResetOtp resetOtp = otpOpt.get();

        if (resetOtp.getExpiresAt().isBefore(LocalDateTime.now())) {
            invalidateOtp(resetOtp);
            return false;
        }

        if (resetOtp.getAttempts() >= MAX_ATTEMPTS) {
            invalidateOtp(resetOtp);
            return false;
        }

        if (!passwordEncoder.matches(otp, resetOtp.getCodeHash())) {
            resetOtp.setAttempts(resetOtp.getAttempts() + 1);
            otpRepository.save(resetOtp);
            return false;
        }

        employee.setPassword(passwordEncoder.encode(newPassword));
        employeeRepository.save(employee);
        invalidateOtp(resetOtp);
        return true;
    }

    private void invalidateOtp(PasswordResetOtp otp) {
        otp.setInvalidated(true);
        otpRepository.save(otp);
    }

    private String generateOtpCode() {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            builder.append(random.nextInt(10));
        }
        return builder.toString();
    }

    @Scheduled(cron = "0 0 * * * *")
    public void purgeExpiredOtps() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(1);
        otpRepository.findByExpiresAtBefore(cutoff)
                .forEach(this::invalidateOtp);
    }
}

