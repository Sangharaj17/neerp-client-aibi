package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.LightFitting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LightFittingRepository extends JpaRepository<LightFitting, Integer> {
    Optional<LightFitting> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
