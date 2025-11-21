package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.CapacityType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CapacityTypeRepository extends JpaRepository<CapacityType, Integer> {
    boolean existsByType(String type);
}
