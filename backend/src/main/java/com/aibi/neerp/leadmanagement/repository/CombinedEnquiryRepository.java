package com.aibi.neerp.leadmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.NewLeads;

@Repository
public interface CombinedEnquiryRepository extends JpaRepository<CombinedEnquiry, Integer> {
	
    Optional<CombinedEnquiry> findByLead(NewLeads lead);
    
    List<CombinedEnquiry> findByLead_LeadId(Integer leadId);

	List<CombinedEnquiry> findByLead_LeadIdAndEnquiryType_EnquiryTypeId(Integer leadId, Integer enquiryTypeId);

    
  //  Optional<CombinedEnquiry> findByLeadId(Integer leadId);


}

