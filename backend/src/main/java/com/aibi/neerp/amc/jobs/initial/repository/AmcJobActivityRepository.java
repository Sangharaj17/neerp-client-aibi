package com.aibi.neerp.amc.jobs.initial.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.common.entity.JobActivityType;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJobActivity;
import com.aibi.neerp.amc.jobs.initial.entity.BreakdownTodo;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AmcJobActivityRepository extends JpaRepository<AmcJobActivity, Integer> {


	List<AmcJobActivity> findByBreakdownTodo_CustTodoId(Integer brekdownTodoId);

	List<AmcJobActivity> findByJob_JobId(Integer jobId);

    List<AmcJobActivity> findByJobJobId(Integer jobId);
    
    @Query("SELECT a FROM AmcJobActivity a " +
            "WHERE a.activityDate BETWEEN :startDate AND :endDate " +
            "AND a.jobActivityBy.employeeId = :empId " +
            // The OR clauses below enable filtering when searchTerm is present, or skips filtering if null/empty.
            "AND (:searchTerm IS NULL OR :searchTerm = '' OR " +
            "LOWER(a.job.customer.customerName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(a.job.site.siteName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(a.jobActivityType.activityName) LIKE LOWER(CONCAT('%', :searchTerm, '%')))"
     )
     Page<AmcJobActivity> findActivitiesWithSearch( // <-- NEW METHOD
             LocalDate startDate, 
             LocalDate endDate, 
             Integer empId, 
             String searchTerm, 
             Pageable pageable);
    // 2. Method for fetching ALL activities (for total counts)
    List<AmcJobActivity> findByActivityDateBetweenAndJobActivityByEmployeeId(
            LocalDate startDate, 
            LocalDate endDate, 
            Integer employeeId);

    /**
	 * Find activities within date range (exclusive)
	 * Using custom query for better performance with proper indexing
	 */
    @Query("SELECT a FROM AmcJobActivity a " +
    	       "WHERE a.activityDate BETWEEN :startDate AND :endDate")
    	List<AmcJobActivity> findByActivityDateBetween(
    	        @Param("startDate") LocalDate startDate,
    	        @Param("endDate") LocalDate endDate);

	
	
	
	

	@Query("""
		       SELECT a FROM AmcJobActivity a 
		       WHERE a.jobActivityBy.employeeId = :empId
		       AND a.activityDate BETWEEN :fromDate AND :toDate
		       """)
		List<AmcJobActivity> findByEmployeeIdAndDateRange(
		        @Param("empId") Integer empId,
		        @Param("fromDate") LocalDate fromDate,
		        @Param("toDate") LocalDate toDate);

	@Query("""
		    SELECT DISTINCT a FROM AmcJobActivity a
		    LEFT JOIN a.job.route r
		    LEFT JOIN r.employees e
		    WHERE a.activityDate BETWEEN :from AND :to
		      AND a.jobActivityBy.employeeId = :empId
		      AND LOWER(a.jobActivityType.activityName) = LOWER(:activityType)
		      AND (
		                LOWER(a.job.lead.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
		             OR LOWER(a.job.site.siteName) LIKE LOWER(CONCAT('%', :search, '%'))
		             OR LOWER(a.jobActivityBy.employeeName) LIKE LOWER(CONCAT('%', :search, '%'))
		             OR LOWER(a.activityDescription) LIKE LOWER(CONCAT('%', :search, '%'))
		             OR LOWER(e.employeeName) LIKE LOWER(CONCAT('%', :search, '%'))      
		          )
		    """)
		Page<AmcJobActivity> findActivitiesWithFilters(
		        @Param("from") LocalDate from,
		        @Param("to") LocalDate to,
		        @Param("empId") Integer empId,
		        @Param("activityType") String activityType,
		        @Param("search") String search,
		        Pageable pageable);

	long countByJob_JobIdAndJobServiceIgnoreCase(Integer jobId, String jobService);

	long countByBreakdownTodo_CustTodoId(Integer custTodoId);

	@Query("SELECT a FROM AmcJobActivity a " +
		       "WHERE a.activityDate BETWEEN :from AND :to " +
		       "AND (:empId IS NULL OR a.jobActivityBy.employeeId = :empId) " +
		       "AND (:type IS NULL OR a.jobActivityType.activityName = :type)")
		List<AmcJobActivity> findActivitiesWithoutPagination(
		        @Param("from") LocalDate from,
		        @Param("to") LocalDate to,
		        @Param("empId") Integer empId,
		        @Param("type") String jobActivityType
		);




  
}

