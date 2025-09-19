package com.aibi.neerp.amc.quatation.renewal.repository;

import com.aibi.neerp.amc.quatation.renewal.entity.RevisedRenewalAmcQuotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RevisedRenewalAmcQuotationRepository extends JpaRepository<RevisedRenewalAmcQuotation, Integer> {
    // Basic CRUD methods provided by JpaRepository
}
