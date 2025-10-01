package com.aibi.neerp.dashboard.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.dashboard.entity.OfficeActivity;

@Repository
public interface OfficeActivityRepository extends JpaRepository<OfficeActivity, Integer> {

    // All office activities with status = 0 (false)
    @Query("""
        SELECT o
        FROM OfficeActivity o
        WHERE o.status = 0 AND
             (:search IS NULL OR :search = '' OR
              LOWER(o.purpose) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<OfficeActivity> searchPendingOfficeActivities(String search, Pageable pageable);
}

