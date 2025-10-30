package com.aibi.neerp.amc.materialrepair.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.materialrepair.entity.WorkPeriod;

import java.util.List;
import java.util.Optional;

// This is the standard Spring Data JPA pattern
// Spring Boot handles the implementation automatically
// for basic CRUD operations.
@Repository
public interface WorkPeriodRepository extends JpaRepository<WorkPeriod, Long> {

    // You can add custom query methods here if needed, e.g.:
    // Optional<WorkPeriod> findByName(String name);
}
