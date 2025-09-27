package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Speed;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpeedRepository extends JpaRepository<Speed, Integer> {
    boolean existsByValue(Double value);
    Optional<Speed> findByValue(Double value);
}
