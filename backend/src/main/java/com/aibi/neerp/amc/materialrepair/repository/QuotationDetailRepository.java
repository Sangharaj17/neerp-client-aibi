package com.aibi.neerp.amc.materialrepair.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.materialrepair.entity.QuotationDetail;

/**
 * Repository for the QuotationDetail (tbl_mod_quot_detail) entity.
 * Used primarily by the MaterialQuotationService to manage line items.
 */
@Repository
public interface QuotationDetailRepository extends JpaRepository<QuotationDetail, Integer> {
    // Integer is the type of the Primary Key (modQuotDetailId)
}
