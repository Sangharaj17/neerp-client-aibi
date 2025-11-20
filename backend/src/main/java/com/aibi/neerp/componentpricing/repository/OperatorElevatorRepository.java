package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.OperatorElevator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OperatorElevatorRepository extends JpaRepository <OperatorElevator, Integer> {
    Optional<OperatorElevator> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
