package com.aibi.neerp.leadmanagement.repository;

import com.aibi.neerp.leadmanagement.entity.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeadStatusRepository extends JpaRepository<LeadStatus, Integer> {
}
