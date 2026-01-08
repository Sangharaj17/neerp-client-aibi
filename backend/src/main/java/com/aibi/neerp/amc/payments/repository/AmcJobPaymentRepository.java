package com.aibi.neerp.amc.payments.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.invoice.entity.AmcInvoice;
import com.aibi.neerp.amc.payments.entity.AmcJobPayment;

// The JpaRepository interface takes two generic parameters:
// 1. The Entity class it manages (AmcJobPayment)
// 2. The data type of the Entity's Primary Key (Integer for paymentId)
@Repository
public interface AmcJobPaymentRepository extends JpaRepository<AmcJobPayment, Integer> {
    
    // --- Custom Query Methods (Examples) ---
	
	// ✅ Required Repository Method Signature
//	@Query("""
//	        SELECT p 
//	        FROM AmcJobPayment p
//	        
//	        LEFT JOIN p.amcJob j 
//	        LEFT JOIN j.site js 
//	        LEFT JOIN j.customer jc 
//	        
//	        LEFT JOIN p.amcRenewalJob r
//	        LEFT JOIN r.site rs
//	        LEFT JOIN r.customer rc
//	        
//	        WHERE (:search IS NULL OR :search = '' OR (
//	            LOWER(p.invoiceNo) LIKE LOWER(CONCAT('%', :search, '%')) OR
//	            LOWER(p.payFor) LIKE LOWER(CONCAT('%', :search, '%')) OR
//	            LOWER(p.paymentType) LIKE LOWER(CONCAT('%', :search, '%')) OR
//	            
//	            LOWER(js.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
//	            LOWER(jc.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
//	            
//	            LOWER(rs.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
//	            LOWER(rc.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
//	        ))
//	        
//	        AND (:dateSearch IS NULL OR :dateSearch = '' OR p.paymentDate = CAST(:dateSearch AS date))
//	    """)
//	Page<AmcJobPayment> searchAllPayments(
//	    @Param("search") String search,
//	    @Param("dateSearch") String dateSearch,
//	    Pageable pageable
//	);
	
	
	@Query("""
		    SELECT p
		    FROM AmcJobPayment p

		    LEFT JOIN p.amcJob j
		    LEFT JOIN j.customer jc
		    LEFT JOIN j.site js

		    LEFT JOIN p.amcRenewalJob r
		    LEFT JOIN r.customer rc
		    LEFT JOIN r.site rs

		    LEFT JOIN p.amcInvoice i

		    LEFT JOIN i.materialQuotation mq
		    LEFT JOIN mq.amcJob mqj
		    LEFT JOIN mqj.customer mqjc
		    LEFT JOIN mqj.site mqjs

		    LEFT JOIN mq.amcRenewalJob mqr
		    LEFT JOIN mqr.customer mqrc
		    LEFT JOIN mqr.site mqrs

		    LEFT JOIN i.onCallQuotation ocq
		    LEFT JOIN ocq.lead ocl

		    LEFT JOIN i.modernization mz
		    LEFT JOIN mz.lead mzl

		    WHERE (
		        :search IS NULL OR :search = '' OR (
		            LOWER(p.invoiceNo) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(p.payFor) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(p.paymentType) LIKE LOWER(CONCAT('%', :search, '%')) OR

		            LOWER(jc.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(js.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR

		            LOWER(rc.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(rs.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR

		            LOWER(mqjc.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(mqjs.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR

		            LOWER(mqrc.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(mqrs.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR

		            LOWER(ocl.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(ocl.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR

		            LOWER(mzl.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(mzl.siteName) LIKE LOWER(CONCAT('%', :search, '%'))
		        )
		    )
		    AND (
		        :dateSearch IS NULL OR :dateSearch = '' 
		        OR p.paymentDate = CAST(:dateSearch AS date)
		    )
		""")
		Page<AmcJobPayment> searchAllPayments(
		    @Param("search") String search,
		    @Param("dateSearch") String dateSearch,
		    Pageable pageable
		);

	
	
	
	// Inside AmcJobPaymentRepository.java

	// Query 1: Main statistics (returning Object[] of 4 values)
	@Query("""
		    SELECT 
		        COUNT(p),
		        SUM(CASE WHEN p.paymentCleared = 'Yes' THEN 1 ELSE 0 END),
		        SUM(CASE WHEN p.paymentCleared != 'Yes' THEN 1 ELSE 0 END),
		        SUM(CASE WHEN p.paymentCleared = 'Yes' THEN p.amountPaid ELSE 0 END)
		    FROM AmcJobPayment p
		""")
		List<Object[]> getPaymentMainSummaryStatistics();


    // Query 2: Payment Type breakdown
    @Query("""
        SELECT 
            p.paymentType,
            COUNT(p),
            SUM(p.amountPaid)
        FROM AmcJobPayment p
        GROUP BY p.paymentType
        ORDER BY COUNT(p) DESC
    """)
    List<Object[]> getPaymentTypeBreakdown();
}