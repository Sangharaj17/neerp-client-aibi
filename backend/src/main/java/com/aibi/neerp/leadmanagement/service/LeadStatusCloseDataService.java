package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.leadmanagement.entity.LeadStatus;
import com.aibi.neerp.leadmanagement.entity.LeadStatusCloseData;
import com.aibi.neerp.leadmanagement.repository.LeadStatusCloseDataRepository;
import com.aibi.neerp.leadmanagement.repository.LeadStatusRepository;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.leadmanagement.repository.NewLeadsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadStatusCloseDataService {

    private final LeadStatusCloseDataRepository leadStatusCloseDataRepository;
    private final NewLeadsRepository newLeadsRepository;
    private final LeadStatusRepository leadStatusRepository;

    /**
     * Save a new close request for a lead.
     */
    @Transactional
    public LeadStatusCloseData createCloseRequest(Integer leadId, String reason, LocalDate expiryDate) {
        NewLeads lead = newLeadsRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found with id: " + leadId));

        LeadStatusCloseData closeData = new LeadStatusCloseData();
        closeData.setLead(lead);
        closeData.setReason(reason);
        closeData.setExpiryDate(expiryDate);

       

        return leadStatusCloseDataRepository.save(closeData);
    }

    /**
     * Get all close requests for a specific lead.
     */
    public List<LeadStatusCloseData> getCloseRequests(Integer leadId) {
        return leadStatusCloseDataRepository.findByLead_LeadId(leadId);
    }

    /**
     * Auto-close leads where expiry date is passed.
     */
    @Transactional
    public int autoCloseExpiredLeads() {
        List<LeadStatusCloseData> allCloseRequests = leadStatusCloseDataRepository.findAll();
        int updatedCount = 0;

        for (LeadStatusCloseData closeData : allCloseRequests) {
            if (closeData.getExpiryDate() != null && closeData.getExpiryDate().isBefore(LocalDate.now())) {

                NewLeads lead = closeData.getLead();

                // Check if not already closed
                if (lead.getLeadStatus() == null || 
                    !"CLOSED".equalsIgnoreCase(lead.getLeadStatus().getStatusName())) {

                    // ✅ Fetch CLOSED status from DB
                    LeadStatus closedStatus = leadStatusRepository.findByStatusNameIgnoreCase("CLOSED").get();
                            //.orElseThrow(() -> new IllegalStateException("LeadStatus 'CLOSED' not found in DB"));

                    lead.setLeadStatus(closedStatus); // set status entity
                    newLeadsRepository.save(lead);

                    updatedCount++;
                }
            }
        }
        return updatedCount;
    }

}

