package com.aibi.neerp.customer.repository;

import com.aibi.neerp.customer.entity.CustomerSiteTodo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CustomerSiteTodoRepository extends JpaRepository<CustomerSiteTodo, Integer> {
    List<CustomerSiteTodo> findByCustomerCustomerId(Integer customerId);
    List<CustomerSiteTodo> findBySiteSiteId(Integer siteId);
    
    @Query("""
            SELECT t
            FROM CustomerSiteTodo t
            JOIN FETCH t.site s
            JOIN FETCH s.customer c
            WHERE (:search IS NULL OR :search = '' OR 
                  LOWER(t.purpose) LIKE LOWER(CONCAT('%', :search, '%')) OR
                  LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                  LOWER(s.siteName) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
        Page<CustomerSiteTodo> searchTodos(String search, Pageable pageable);
    
    
    // ✅ Upcoming (Not Performed) Todos - date >= today
    @Query("""
            SELECT t
            FROM CustomerSiteTodo t
            JOIN FETCH t.site s
            JOIN FETCH s.customer c
            WHERE t.date >= :today AND
                 (:search IS NULL OR :search = '' OR 
                  LOWER(t.purpose) LIKE LOWER(CONCAT('%', :search, '%')) OR
                  LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                  LOWER(s.siteName) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<CustomerSiteTodo> searchUpcomingTodos(String search, LocalDate today, Pageable pageable);

    // ✅ Missed Todos - date < today
    @Query("""
            SELECT t
            FROM CustomerSiteTodo t
            JOIN FETCH t.site s
            JOIN FETCH s.customer c
            WHERE t.date < :today AND
                 (:search IS NULL OR :search = '' OR 
                  LOWER(t.purpose) LIKE LOWER(CONCAT('%', :search, '%')) OR
                  LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                  LOWER(s.siteName) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<CustomerSiteTodo> searchMissedTodos(String search, LocalDate today, Pageable pageable);
}
