package com.aibi.neerp.amc.jobs.initial.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

  
}

