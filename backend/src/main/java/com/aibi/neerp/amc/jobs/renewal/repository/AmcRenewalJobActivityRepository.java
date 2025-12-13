package com.aibi.neerp.amc.jobs.renewal.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJobActivity;

public interface AmcRenewalJobActivityRepository extends JpaRepository<AmcRenewalJobActivity, Integer>{

	List<AmcRenewalJobActivity> findByBreakdownTodo_CustTodoId(Integer breakdownTodoId);

	List<AmcRenewalJobActivity> findByAmcRenewalJobRenewalJobId(Integer jobId);
	
	
	 @Query("SELECT a FROM AmcRenewalJobActivity a " +
	           "WHERE a.activityDate BETWEEN :startDate AND :endDate " +
	           "AND a.jobActivityBy.employeeId = :empId " +
	           // The OR clauses below enable filtering when searchTerm is present, or skips filtering if null/empty.
	           "AND (:searchTerm IS NULL OR :searchTerm = '' OR " +
	           "LOWER(a.amcRenewalJob.customer.customerName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " + // Note the path change
	           "LOWER(a.amcRenewalJob.site.siteName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " + // Note the path change
	           "LOWER(a.jobActivityType.activityName) LIKE LOWER(CONCAT('%', :searchTerm, '%')))"
	    )
	    Page<AmcRenewalJobActivity> findActivitiesWithSearch( // <-- NEW METHOD
	            LocalDate startDate, 
	            LocalDate endDate, 
	            Integer empId, 
	            String searchTerm, 
	            Pageable pageable);
            
    // 2. Method for fetching ALL activities (for total counts)
    List<AmcRenewalJobActivity> findByActivityDateBetweenAndJobActivityByEmployeeId(
            LocalDate startDate, 
            LocalDate endDate, 
            Integer employeeId);

    /**
	 * Find activities within date range (exclusive)
	 */
    @Query("SELECT a FROM AmcRenewalJobActivity a " +
    	       "WHERE a.activityDate BETWEEN :startDate AND :endDate")
    	List<AmcRenewalJobActivity> findByActivityDateBetween(
    	        @Param("startDate") LocalDate startDate,
    	        @Param("endDate") LocalDate endDate);

	
	
	
	

	@Query("""
		       SELECT a FROM AmcRenewalJobActivity a 
		       WHERE a.jobActivityBy.employeeId = :empId
		       AND a.activityDate BETWEEN :fromDate AND :toDate
		       """)
		List<AmcRenewalJobActivity> findByEmployeeIdAndDateRange(
		        @Param("empId") Integer empId,
		        @Param("fromDate") LocalDate fromDate,
		        @Param("toDate") LocalDate toDate);

	@Query("""
		    SELECT DISTINCT a FROM AmcRenewalJobActivity a
		    LEFT JOIN a.amcRenewalJob.route r
		    LEFT JOIN r.employees e
		    WHERE a.activityDate BETWEEN :from AND :to
		      AND a.jobActivityBy.employeeId = :empId
		      AND LOWER(a.jobActivityType.activityName) = LOWER(:activityType)
		      AND (
		                LOWER(a.amcRenewalJob.lead.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
		             OR LOWER(a.amcRenewalJob.site.siteName) LIKE LOWER(CONCAT('%', :search, '%'))
		             OR LOWER(a.jobActivityBy.employeeName) LIKE LOWER(CONCAT('%', :search, '%'))
		             OR LOWER(a.activityDescription) LIKE LOWER(CONCAT('%', :search, '%'))
		             OR LOWER(e.employeeName) LIKE LOWER(CONCAT('%', :search, '%'))     
		         )
		    """)
		Page<AmcRenewalJobActivity> findActivitiesWithFilters(
		        @Param("from") LocalDate from,
		        @Param("to") LocalDate to,
		        @Param("empId") Integer empId,
		        @Param("activityType") String activityType,
		        @Param("search") String search,
		        Pageable pageable);

	//long countByRenewalJob_JobIdAndJobServiceIgnoreCase(Integer jobId, String jobService);

	long countByBreakdownTodo_CustTodoId(Integer custTodoId);

	//long countByAmcRenewalJob_JobIdAndJobServiceIgnoreCase(Integer jobId, String jobService);

	long countByAmcRenewalJob_RenewalJobIdAndJobServiceIgnoreCase(Integer renewalJobId, String jobService);

	@Query("SELECT a FROM AmcRenewalJobActivity a " +
		       "WHERE a.activityDate BETWEEN :from AND :to " +
		       "AND (:empId IS NULL OR a.jobActivityBy.employeeId = :empId) " +
		       "AND (:type IS NULL OR a.jobActivityType.activityName = :type)")
		List<AmcRenewalJobActivity> findActivitiesWithoutPagination(
		        @Param("from") LocalDate from,
		        @Param("to") LocalDate to,
		        @Param("empId") Integer empId,
		        @Param("type") String jobActivityType
		);




}
