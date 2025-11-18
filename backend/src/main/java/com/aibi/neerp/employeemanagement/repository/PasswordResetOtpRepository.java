package com.aibi.neerp.employeemanagement.repository;

import com.aibi.neerp.employeemanagement.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findTopByEmailAndInvalidatedFalseOrderByCreatedAtDesc(String email);

    List<PasswordResetOtp> findByExpiresAtBefore(LocalDateTime expiryCutoff);
}

