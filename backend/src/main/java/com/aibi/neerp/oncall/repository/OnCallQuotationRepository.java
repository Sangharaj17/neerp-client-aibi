package com.aibi.neerp.oncall.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.aibi.neerp.oncall.entity.OnCallQuotation;

public interface OnCallQuotationRepository extends JpaRepository<OnCallQuotation, Integer>{
	
	 @Query("""
		        SELECT DISTINCT o
		        FROM OnCallQuotation o
		        LEFT JOIN o.lead l
		        WHERE (
		            :search IS NULL OR :search = '' OR
		            LOWER(l.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(l.siteName) LIKE LOWER(CONCAT('%', :search, '%'))
		        )
		        AND (
		            :dateSearch IS NULL OR :dateSearch = '' OR
		            o.quotationDate = CAST(:dateSearch AS date)
		        )
		    """)
		    Page<OnCallQuotation> searchAll(
		            @Param("search") String search,
		            @Param("dateSearch") String dateSearch,
		            Pageable pageable
		    );

}
