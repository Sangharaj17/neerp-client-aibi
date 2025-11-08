package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.AirType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AirTypeRepository extends JpaRepository<AirType, Integer> {

    boolean existsByNameIgnoreCase(String name);
}
