package com.aibi.neerp.amc.jobs.renewal.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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

}
