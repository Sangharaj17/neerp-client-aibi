package com.aibi.neerp.amc.jobs.initial.repository;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;

@Repository
public interface AmcJobRepository extends JpaRepository<AmcJob, Integer> {

    // You can add custom queries later if needed, e.g.:
    // List<AmcJob> findByJobStatus(String jobStatus);
    // List<AmcJob> findByCustomerCustomerId(Integer customerId);
	 

	  
//	  @Query("""
//		        SELECT DISTINCT j
//		        FROM AmcJob j
//		        LEFT JOIN FETCH j.customer c
//		        LEFT JOIN FETCH j.site s
//		        LEFT JOIN FETCH j.route r
//		        LEFT JOIN FETCH r.employees e
//		        WHERE (:search IS NULL OR 
//		               LOWER(j.contractType) LIKE LOWER(CONCAT('%', :search, '%')) OR
//		               LOWER(j.startDate) LIKE LOWER(CONCAT('%', :search, '%')) OR
//		               LOWER(j.endDate) LIKE LOWER(CONCAT('%', :search, '%')) OR
//		               LOWER(j.jobAmount) LIKE LOWER(CONCAT('%', :search, '%')) OR
//		               LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
//		               LOWER(s.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
//		               LOWER(s.siteAddress) LIKE LOWER(CONCAT('%', :search, '%')) OR
//		               LOWER(j.paymentTerm) LIKE LOWER(CONCAT('%', :search, '%')))
//		    """)
//		    Page<AmcJob> searchAll(@Param("search") String search, Pageable pageable);
	@Query("""
	        SELECT DISTINCT j
	        FROM AmcJob j
	        LEFT JOIN FETCH j.customer c
	        LEFT JOIN FETCH j.site s
	        LEFT JOIN FETCH j.route r
	        LEFT JOIN FETCH r.employees e
	        LEFT JOIN FETCH j.amcQuotation q
	        LEFT JOIN FETCH q.lead l
	        LEFT JOIN FETCH l.area a
	       WHERE (:search = '' OR 
       LOWER(j.contractType) LIKE LOWER(CONCAT('%', :search, '%')) OR
       CAST(j.startDate AS string) LIKE LOWER(CONCAT('%', :search, '%')) OR
       CAST(j.endDate AS string) LIKE LOWER(CONCAT('%', :search, '%')) OR
       CAST(j.jobAmount AS string) LIKE LOWER(CONCAT('%', :search, '%')) OR
       LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
       LOWER(s.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
       LOWER(s.siteAddress) LIKE LOWER(CONCAT('%', :search, '%')) OR
       LOWER(j.paymentTerm) LIKE LOWER(CONCAT('%', :search, '%')) OR
       LOWER(l.leadCompanyName) LIKE LOWER(CONCAT('%', :search, '%')) OR
       LOWER(a.areaName) LIKE LOWER(CONCAT('%', :search, '%')))

	        """)
	    Page<AmcJob> searchAll(@Param("search") String search, Pageable pageable);
	
	@Query("""
		    SELECT j
		    FROM AmcJob j
		    LEFT JOIN FETCH j.customer c
		    LEFT JOIN FETCH j.site s
		    WHERE j.status = true
		""")
		List<AmcJob> findAllActiveJobs();


}

