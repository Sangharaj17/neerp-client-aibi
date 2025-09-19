package com.aibi.neerp.user.repository;

import com.aibi.neerp.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndPassword(String email, String password);

    @Modifying
    @Query("UPDATE User u SET u.loginFlag = :flag WHERE u.id = :userId")
    void updateLoginFlag(@Param("userId") Long userId, @Param("flag") boolean flag);

}
