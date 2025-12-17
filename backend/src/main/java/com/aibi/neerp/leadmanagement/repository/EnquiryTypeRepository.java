package com.aibi.neerp.leadmanagement.repository;

import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnquiryTypeRepository extends JpaRepository<EnquiryType, Integer> {

	boolean existsByEnquiryTypeName(String name);

	EnquiryType findByEnquiryTypeName(String string);
}
