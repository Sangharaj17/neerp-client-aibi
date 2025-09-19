package com.aibi.neerp.leadmanagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.leadmanagement.entity.NewLeads;

import java.util.List;

@Repository
public interface NewLeadsRepository extends JpaRepository<NewLeads, Integer> {

    @Query("SELECT l FROM NewLeads l " +
            "LEFT JOIN l.leadSource s " +
            "LEFT JOIN l.activityBy e " +
            "WHERE " +
            "LOWER(l.customerName) LIKE %:keyword% OR " +
            "LOWER(l.siteName) LIKE %:keyword% OR " +
            "LOWER(l.address) LIKE %:keyword% OR " +
            "LOWER(l.leadType) LIKE %:keyword% OR " +
            "LOWER(l.contactNo) LIKE %:keyword% OR " +
            "LOWER(s.sourceName) LIKE %:keyword% OR " +
            "LOWER(e.employeeName) LIKE %:keyword% OR " +
            "CAST(l.leadDate AS string) LIKE %:keyword%")
    Page<NewLeads> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Spring Data JPA will generate:
    // SELECT * FROM new_leads WHERE lead_type IN ('New Installation','Modernization')
    List<NewLeads> findByLeadTypeIn(List<String> leadTypes);
}
