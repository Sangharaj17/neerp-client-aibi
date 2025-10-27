package com.aibi.neerp.amc.jobs.initial.repository;


import java.time.LocalDate;
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
//	@Query("""
//		    SELECT DISTINCT j
//		    FROM AmcJob j
//		    LEFT JOIN FETCH j.customer c
//		    LEFT JOIN FETCH j.site s
//		    LEFT JOIN FETCH j.route r
//		    LEFT JOIN FETCH r.employees e
//		    LEFT JOIN FETCH j.amcQuotation q
//		    LEFT JOIN FETCH q.lead l
//		    LEFT JOIN FETCH l.area a
//		    WHERE (:search = '' OR 
//		       LOWER(j.contractType) LIKE LOWER(CONCAT('%', :search, '%')) OR
//		       FUNCTION('DATE_FORMAT', j.startDate, '%Y-%m-%d') LIKE CONCAT('%', :search, '%') OR
//		       FUNCTION('DATE_FORMAT', j.endDate, '%Y-%m-%d') LIKE CONCAT('%', :search, '%') OR
//		       CAST(j.jobAmount AS string) LIKE CONCAT('%', :search, '%') OR
//		       LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
//		       LOWER(s.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
//		       LOWER(s.siteAddress) LIKE LOWER(CONCAT('%', :search, '%')) OR
//		       LOWER(j.paymentTerm) LIKE LOWER(CONCAT('%', :search, '%')) OR
//		       LOWER(l.leadCompanyName) LIKE LOWER(CONCAT('%', :search, '%')) OR
//		       LOWER(a.areaName) LIKE LOWER(CONCAT('%', :search, '%'))
//		    )
//		""")
//		Page<AmcJob> searchAll(@Param("search") String search, Pageable pageable);

	@Query("""
		    SELECT DISTINCT j
		    FROM AmcJob j
		    LEFT JOIN j.customer c
		    LEFT JOIN j.site s
		    LEFT JOIN j.route r
		    LEFT JOIN r.employees e
		    LEFT JOIN j.amcQuotation q
		    LEFT JOIN q.lead l
		    LEFT JOIN l.area a
		    WHERE (:search IS NULL OR :search = '' OR (
		        LOWER(j.contractType) LIKE LOWER(CONCAT('%', :search, '%')) OR
		        CAST(j.jobAmount AS string) LIKE CONCAT('%', :search, '%') OR
		        LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		        LOWER(s.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		        LOWER(s.siteAddress) LIKE LOWER(CONCAT('%', :search, '%')) OR
		        LOWER(j.paymentTerm) LIKE LOWER(CONCAT('%', :search, '%')) OR
		        LOWER(l.leadCompanyName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		        LOWER(a.areaName) LIKE LOWER(CONCAT('%', :search, '%'))
		    ))
		    AND (:dateSearch IS NULL OR :dateSearch = '' OR j.startDate = CAST(:dateSearch AS date) OR j.endDate = CAST(:dateSearch AS date))
		""")
		Page<AmcJob> searchAll(
		    @Param("search") String search,
		    @Param("dateSearch") String dateSearch,
		    Pageable pageable
		);
	
	
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
		""")
		List<AmcJob> findAllForExport();




	
	@Query("""
		    SELECT j
		    FROM AmcJob j
		    LEFT JOIN FETCH j.customer c
		    LEFT JOIN FETCH j.site s
		    WHERE j.status = true
		""")
		List<AmcJob> findAllActiveJobs();
	
	@Query("""
			SELECT j FROM AmcJob j
			WHERE j.status = true
			  AND (LOWER(j.site.siteName) LIKE LOWER(CONCAT('%', :search, '%'))
			    OR LOWER(j.customer.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
			    OR LOWER(j.currentServiceStatus) LIKE LOWER(CONCAT('%', :search, '%')))
			""")
			Page<AmcJob> findByStatusTrue(@Param("search") String search, Pageable pageable);




	//Integer countByRenewlStatusAndEndDateBefore(int i, LocalDate currentDate);

	@Query("""
		    SELECT COUNT(j)
		    FROM AmcJob j
		    WHERE j.renewlStatus = :renewlStatus
		      AND j.lead.leadStatus.statusName = 'Active'
		       AND j.isRenewalQuatationCreated =false
		      AND FUNCTION('TIMESTAMPDIFF', DAY, j.endDate, :currentDate) <= 30
		""")
		Integer countByRenewlStatusAndEndDateDiffLessThan30(
		    @Param("renewlStatus") Integer renewlStatus,
		    @Param("currentDate") LocalDate currentDate
		);
	
//	 @Query("""
//		        SELECT j
//		        FROM AmcJob j
//		        WHERE j.renewlStatus = :renewlStatus
//		          AND j.lead.leadStatus.statusName = 'Active'
//		          AND FUNCTION('TIMESTAMPDIFF', DAY, j.endDate, :currentDate) <= 30
//		          AND (:search IS NULL OR LOWER(j.customer.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
//		              OR LOWER(j.site.siteName) LIKE LOWER(CONCAT('%', :search, '%')))
//		    """)
//		    Page<AmcJob> searchAmcRenewals(
//		            @Param("renewlStatus") Integer renewlStatus,
//		            @Param("currentDate") LocalDate currentDate,
//		            @Param("search") String search,
//		            Pageable pageable
//		    );
	
	@Query("""
		    SELECT j
		    FROM AmcJob j
		    WHERE j.renewlStatus = :renewlStatus
		      AND j.lead.leadStatus.statusName = 'Active'
		      AND j.isRenewalQuatationCreated =false
		      AND FUNCTION('TIMESTAMPDIFF', DAY, j.endDate, :currentDate) >= -30
		      AND (
		            :search IS NULL
		            OR LOWER(j.customer.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
		            OR LOWER(j.site.siteName) LIKE LOWER(CONCAT('%', :search, '%'))
		            OR CAST(j.jobId AS string) LIKE CONCAT('%', :search, '%')
		            OR CAST(j.jobAmount AS string) LIKE CONCAT('%', :search, '%')
		          )
		    """)
		Page<AmcJob> searchAmcRenewals(
		        @Param("renewlStatus") Integer renewlStatus,
		        @Param("currentDate") LocalDate currentDate,
		        @Param("search") String search,
		        Pageable pageable
		);

	
	@Query("""
		    SELECT COUNT(j)
		    FROM AmcJob j
		    WHERE j.renewlStatus = :renewlStatus
		      AND j.lead.leadStatus.statusName = 'Active'
		      AND FUNCTION('TIMESTAMPDIFF', DAY, j.endDate, :currentDate) >= -30
		""")
		Integer countAmcRenewalsDueWithin30Days(
		        @Param("renewlStatus") Integer renewlStatus,
		        @Param("currentDate") LocalDate currentDate
		);



	




}

