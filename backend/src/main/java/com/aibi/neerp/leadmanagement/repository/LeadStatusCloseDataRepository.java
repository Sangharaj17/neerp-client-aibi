package com.aibi.neerp.leadmanagement.repository;


import com.aibi.neerp.leadmanagement.entity.LeadStatusCloseData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadStatusCloseDataRepository extends JpaRepository<LeadStatusCloseData, Integer> {

    // Find all close records for a specific lead
    List<LeadStatusCloseData> findByLead_LeadId(Integer leadId);

    // Optional: Get active (not expired) close record for a lead
    List<LeadStatusCloseData> findByLead_LeadIdAndExpiryDateAfter(Integer leadId, java.time.LocalDate today);
}

