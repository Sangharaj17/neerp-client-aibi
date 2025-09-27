package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.AdditionalFloors;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdditionalFloorsRepository extends JpaRepository<AdditionalFloors, Integer> {
    Optional<AdditionalFloors> findByCode(String code);
    boolean existsByCode(String code);
}
