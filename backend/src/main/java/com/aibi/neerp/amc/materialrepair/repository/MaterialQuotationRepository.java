package com.aibi.neerp.amc.materialrepair.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.materialrepair.entity.MaterialQuotation;

/**
 * Repository for the MaterialQuotation (tbl_mod_quot) entity.
 * Provides standard CRUD operations for the quotation header.
 */
@Repository
public interface MaterialQuotationRepository extends JpaRepository<MaterialQuotation, Integer> {
    // Integer is the type of the Primary Key (modQuotId)
	
	@Query("""
		    SELECT DISTINCT m
		    FROM MaterialQuotation m
		    LEFT JOIN m.amcJob j
		    LEFT JOIN j.site s
		    LEFT JOIN j.customer c
		    LEFT JOIN m.amcRenewalJob r
		    LEFT JOIN r.site rs
		    LEFT JOIN r.customer rc
		    WHERE (
		        :search IS NULL OR :search = '' OR
		        LOWER(s.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		        LOWER(rs.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		        LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		        LOWER(rc.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
		    )
		    AND (
		        :dateSearch IS NULL OR :dateSearch = '' OR
		        m.quatationDate = CAST(:dateSearch AS date)
		    )
		""")
		Page<MaterialQuotation> searchAll(
		    @Param("search") String search,
		    @Param("dateSearch") String dateSearch,
		    Pageable pageable
		);

}