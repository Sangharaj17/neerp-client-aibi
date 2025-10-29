// src/main/java/com/aibi/neerp/settings/repository/CompanySettingRepository.java

package com.aibi.neerp.settings.repository;

import com.aibi.neerp.settings.entity.CompanySetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanySettingRepository extends JpaRepository<CompanySetting, String> {
    
    Optional<CompanySetting> findByRefName(String refName);
}