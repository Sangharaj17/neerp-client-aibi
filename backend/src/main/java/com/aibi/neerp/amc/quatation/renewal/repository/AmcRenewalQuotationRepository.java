package com.aibi.neerp.amc.quatation.renewal.repository;

import com.aibi.neerp.amc.quatation.initial.entity.AmcQuotation;
import com.aibi.neerp.amc.quatation.renewal.entity.AmcRenewalQuotation;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AmcRenewalQuotationRepository extends JpaRepository<AmcRenewalQuotation, Integer> {
    // Basic CRUD methods are provided by JpaRepository
	
	@Query("""
		    SELECT DISTINCT q
		    FROM AmcRenewalQuotation q
		    LEFT JOIN q.customer c
		    LEFT JOIN q.site s
		    LEFT JOIN q.createdBy e
		    LEFT JOIN q.lead l
		    LEFT JOIN l.area a
		    LEFT JOIN q.makeOfElevator m
		    WHERE (:search IS NULL OR :search = '' OR (
		        LOWER(l.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		        LOWER(s.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		        LOWER(e.employeeName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		        LOWER(a.areaName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		        LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%'))
		    ))
		    AND (:dateSearch IS NULL OR :dateSearch = '' OR q.quatationDate = CAST(:dateSearch AS date))
		""")
		Page<AmcRenewalQuotation> searchAll(
		    @Param("search") String search, 
		    @Param("dateSearch") String dateSearch, 
		    Pageable pageable
		);

	
	  @Query("SELECT a FROM AmcRenewalQuotation a " +
	            "JOIN FETCH a.customer c " +
	            "JOIN FETCH a.site s " +
	            "WHERE a.isFinal = 1 AND a.jobStatus = 0")
	     List<AmcRenewalQuotation> findFinalPendingAmcRenewalQuotations();
    

}
