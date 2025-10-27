package com.aibi.neerp.amc.jobs.initial.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.jobs.initial.entity.BreakdownTodo;

@Repository
public interface BreakdownTodoRepository extends JpaRepository<BreakdownTodo, Integer> {

	List<BreakdownTodo> findByJob_JobId(Integer jobId);
	
	 // Upcoming breakdown todos (date >= today)
    @Query("""
        SELECT b
        FROM BreakdownTodo b
        JOIN FETCH b.customerSite s
        JOIN FETCH s.customer c
        WHERE b.todoDate >= :today AND
             (:search IS NULL OR :search = '' OR
              LOWER(b.purpose) LIKE LOWER(CONCAT('%', :search, '%')) OR
              LOWER(s.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
              LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<BreakdownTodo> searchUpcomingBreakdownTodos(String search, LocalDate today, Pageable pageable);

    // Missed breakdown todos (date < today)
    @Query("""
        SELECT b
        FROM BreakdownTodo b
        JOIN FETCH b.customerSite s
        JOIN FETCH s.customer c
        WHERE b.todoDate < :today AND
             (:search IS NULL OR :search = '' OR
              LOWER(b.purpose) LIKE LOWER(CONCAT('%', :search, '%')) OR
              LOWER(s.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
              LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<BreakdownTodo> searchMissedBreakdownTodos(String search, LocalDate today, Pageable pageable);

	List<BreakdownTodo> findByRenewalJob_RenewalJobId(Integer renewalJobId);
	
}

