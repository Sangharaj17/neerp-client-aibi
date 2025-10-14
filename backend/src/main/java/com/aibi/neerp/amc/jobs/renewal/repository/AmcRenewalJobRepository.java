package com.aibi.neerp.amc.jobs.renewal.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;


@Repository
public interface AmcRenewalJobRepository extends JpaRepository<AmcRenewalJob, Integer> {
	
	@Query("""
		    SELECT DISTINCT j
		    FROM AmcRenewalJob j
		    LEFT JOIN j.customer c
		    LEFT JOIN j.site s
		    LEFT JOIN j.route r
		    LEFT JOIN r.employees e
		    LEFT JOIN j.amcRenewalQuotation q
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
		Page<AmcRenewalJob> searchAll(
		    @Param("search") String search,
		    @Param("dateSearch") String dateSearch,
		    Pageable pageable
		);
	
	
	@Query("""
		    SELECT j
		    FROM AmcRenewalJob j
		    LEFT JOIN FETCH j.customer c
		    LEFT JOIN FETCH j.site s
		    WHERE j.status = true
		""")
		List<AmcRenewalJob> findAllActiveRenewalJobs();
	
	
	   @Query("""
				SELECT j FROM AmcRenewalJob j
				WHERE j.status = true
				 AND (LOWER(j.site.siteName) LIKE LOWER(CONCAT('%', :search, '%'))
			    OR LOWER(j.customer.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
			    OR LOWER(j.currentServiceStatus) LIKE LOWER(CONCAT('%', :search, '%')))
				""")
				Page<AmcRenewalJob> findByStatusTrue(@Param("search") String search, Pageable pageable);
	   

		    @Query("""
		        SELECT j
		        FROM AmcRenewalJob j
		        WHERE 
		            j.renewalJobId IN (
		                SELECT MAX(jr.renewalJobId)
		                FROM AmcRenewalJob jr
		                WHERE 
		                    jr.preJobId.lead.leadStatus.statusName = 'Active'
		                    AND jr.isRenewalQuatationCreated = false
		                    AND FUNCTION('TIMESTAMPDIFF', DAY, jr.endDate, :currentDate) >= -30
		                GROUP BY jr.preJobId
		            )
		            AND (
		                  :search IS NULL
		                  OR LOWER(j.customer.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
		                  OR LOWER(j.site.siteName) LIKE LOWER(CONCAT('%', :search, '%'))
		                  OR CAST(j.renewalJobId AS string) LIKE CONCAT('%', :search, '%')
		                  OR CAST(j.jobAmount AS string) LIKE CONCAT('%', :search, '%')
		            )
		        """)
		    Page<AmcRenewalJob> searchAmcLatestRenewals(
		           
		            @Param("currentDate") LocalDate currentDate,
		            @Param("search") String search,
		            Pageable pageable
		    );
		    
		    @Query("""
		    	    SELECT COUNT(j)
		    	    FROM AmcRenewalJob j
		    	    WHERE 
		    	        j.renewalJobId IN (
		    	            SELECT MAX(jr.renewalJobId)
		    	            FROM AmcRenewalJob jr
		    	            WHERE 
		    	                jr.preJobId.lead.leadStatus.statusName = 'Active'
		    	                AND jr.isRenewalQuatationCreated = false
		    	                AND FUNCTION('TIMESTAMPDIFF', DAY, jr.endDate, :currentDate) >= -30
		    	            GROUP BY jr.preJobId
		    	        )
		    	    """)
		    	Long countAmcLatestRenewals(
		    	        @Param("currentDate") LocalDate currentDate
		    	);

		

	
}

