package com.aibi.neerp.amc.quatation.renewal.repository;

import com.aibi.neerp.amc.quatation.renewal.entity.AmcRenewalQuotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AmcRenewalQuotationRepository extends JpaRepository<AmcRenewalQuotation, Integer> {
    // Basic CRUD methods are provided by JpaRepository
}
