package com.aibi.neerp.leadmanagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.leadmanagement.entity.LeadSource;

@Repository
public interface LeadSourceRepository extends JpaRepository<LeadSource, Integer> {
	
    Page<LeadSource> findBySourceNameContainingIgnoreCase(String keyword, Pageable pageable);

}
