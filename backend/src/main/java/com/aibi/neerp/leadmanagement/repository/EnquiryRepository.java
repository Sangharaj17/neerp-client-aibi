package com.aibi.neerp.leadmanagement.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.aibi.neerp.leadmanagement.dto.EnquiryResponseDto;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Integer> {
	
//	List<Enquiry> findByCombinedEnquiryIsNull();
	long countByCombinedEnquiry(CombinedEnquiry combinedEnquiry);
//	Collection<EnquiryResponseDto> findByCombinedEnquiryIsNullAndEnquiryType_EnquiryTypeId(Integer enquiryTypeId);

	List<Enquiry> findByCombinedEnquiryIsNullAndEnquiryType_EnquiryTypeId(Integer enquiryTypeId);

	List<Enquiry> findByEnquiryType(EnquiryType type);
	
	@Modifying
	@Transactional
	@Query(value = "DELETE FROM tbl_enquiry WHERE enquiry_id = :id", nativeQuery = true)
	void deleteByEnquiryId(@Param("id") Integer id);


	List<Enquiry> findByLead_LeadIdAndCombinedEnquiryId(Integer leadId, Integer enquiryId);



}
