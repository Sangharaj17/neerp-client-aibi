package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Warranty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface WarrantyRepository extends JpaRepository<Warranty, Integer> {
    boolean existsByWarrantyMonth(Integer warrantyMonth);

    @Modifying
    @Query(value = "TRUNCATE TABLE tbl_warranty RESTART IDENTITY CASCADE", nativeQuery = true)
    void truncateAndReset();
}
