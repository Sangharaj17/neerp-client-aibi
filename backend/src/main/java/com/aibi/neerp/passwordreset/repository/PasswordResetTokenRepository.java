package com.aibi.neerp.passwordreset.repository;

import com.aibi.neerp.passwordreset.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    
    List<PasswordResetToken> findByEmailAndUsedFalse(String email);
    
    List<PasswordResetToken> findByTokenHashContainingAndUsedFalse(String tokenHash);
}

