package com.aibi.neerp.siteexpences.repository;

import com.aibi.neerp.siteexpences.entity.SiteExpense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface SiteExpenseRepository extends JpaRepository<SiteExpense, Integer> {

    // Existing search query  jobType
    @Query("""
        SELECT e
        FROM SiteExpense e
        WHERE
            (:search IS NULL OR :search = '' OR (
                LOWER(CAST(e.amount AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(e.narration) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(e.jobType) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(CAST(e.expenseType AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(CAST(e.paymentMethod AS string)) LIKE LOWER(CONCAT('%', :search, '%'))
            ))
        AND (:dateSearch IS NULL OR :dateSearch = ''
             OR e.expenseDate = CAST(:dateSearch AS date))
        """)
    Page<SiteExpense> searchAllSiteExpenses(
            @Param("search") String search,
            @Param("dateSearch") String dateSearch,
            Pageable pageable
    );

    // ==================== DASHBOARD QUERIES ====================
    
    // Total Expenses
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM SiteExpense e")
    BigDecimal getTotalExpenses();
    
    @Query("SELECT COUNT(e) FROM SiteExpense e")
    Long getTotalExpenseCount();
    
    // Today's Expenses
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM SiteExpense e WHERE e.expenseDate = :today")
    BigDecimal getTodayExpenses(@Param("today") LocalDate today);
    
    @Query("SELECT COUNT(e) FROM SiteExpense e WHERE e.expenseDate = :today")
    Long getTodayExpenseCount(@Param("today") LocalDate today);
    
    // This Month Expenses
    @Query("""
        SELECT COALESCE(SUM(e.amount), 0) 
        FROM SiteExpense e 
        WHERE YEAR(e.expenseDate) = :year 
        AND MONTH(e.expenseDate) = :month
        """)
    BigDecimal getThisMonthExpenses(@Param("year") int year, @Param("month") int month);
    
    @Query("""
        SELECT COUNT(e) 
        FROM SiteExpense e 
        WHERE YEAR(e.expenseDate) = :year 
        AND MONTH(e.expenseDate) = :month
        """)
    Long getThisMonthExpenseCount(@Param("year") int year, @Param("month") int month);
    
    // Category-wise Expenses (handling enum)
    @Query("""
        SELECT CAST(e.expenseType AS string), COALESCE(SUM(e.amount), 0)
        FROM SiteExpense e
        GROUP BY e.expenseType
        ORDER BY SUM(e.amount) DESC
        """)
    List<Object[]> getExpensesByCategory();
    
    // Monthly Expense Trend (Last 12 months)
    @Query("""
        SELECT 
            CONCAT(YEAR(e.expenseDate), '-', LPAD(CAST(MONTH(e.expenseDate) AS string), 2, '0')) as month,
            COALESCE(SUM(e.amount), 0) as amount,
            COUNT(e) as count
        FROM SiteExpense e
        WHERE e.expenseDate >= :startDate
        GROUP BY YEAR(e.expenseDate), MONTH(e.expenseDate)
        ORDER BY YEAR(e.expenseDate), MONTH(e.expenseDate)
        """)
    List<Object[]> getMonthlyExpenseTrend(@Param("startDate") LocalDate startDate);
    
    // Top 5 Expensive AMC Jobs
    @Query("""
    	    SELECT 
    	        e.amcJob.customer.customerName,
    	        e.jobType,
    	        e.amcJob.site.siteName,
    	        COALESCE(SUM(e.amount), 0),
    	        COUNT(e)
    	    FROM SiteExpense e
    	    WHERE e.amcJob IS NOT NULL
    	    GROUP BY 
    	        e.amcJob.jobId,
    	        e.amcJob.customer.customerName,
    	        e.jobType,
    	        e.amcJob.site.siteName
    	    ORDER BY SUM(e.amount) DESC
    	    """)
    	List<Object[]> getTopExpensiveAmcJobs(Pageable pageable);

    
    // Top 5 Expensive AMC Renewal Jobs
    	@Query("""
    		    SELECT 
    		        e.amcRenewalJob.customer.customerName,
    		        e.jobType,
    		        e.amcRenewalJob.site.siteName,
    		        COALESCE(SUM(e.amount), 0),
    		        COUNT(e)
    		    FROM SiteExpense e
    		    WHERE e.amcRenewalJob IS NOT NULL
    		    GROUP BY 
    		        e.amcRenewalJob.renewalJobId,
    		        e.amcRenewalJob.customer.customerName,
    		        e.jobType,
    		        e.amcRenewalJob.site.siteName
    		    ORDER BY SUM(e.amount) DESC
    		    """)
    		List<Object[]> getTopExpensiveAmcRenewalJobs(Pageable pageable);

    
    // Latest 10 Expenses
    @Query("SELECT e FROM SiteExpense e ORDER BY e.expenseDate DESC, e.expenseId DESC")
    List<SiteExpense> getLatestExpenses(Pageable pageable);
}