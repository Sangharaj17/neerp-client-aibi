package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.CabinCeiling;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CabinCeilingRepository extends JpaRepository<CabinCeiling, Integer> {
    Optional<CabinCeiling> findByCeilingNameIgnoreCase(String name);
}
