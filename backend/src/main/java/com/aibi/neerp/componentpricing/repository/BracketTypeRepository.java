package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.BracketType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BracketTypeRepository extends JpaRepository<BracketType, Integer> {
    Optional<BracketType> findByNameIgnoreCase(String sanitizedName);
}
