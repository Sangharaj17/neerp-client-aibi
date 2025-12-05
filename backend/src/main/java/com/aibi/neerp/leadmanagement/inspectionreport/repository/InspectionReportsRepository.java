package com.aibi.neerp.leadmanagement.inspectionreport.repository;

import com.aibi.neerp.leadmanagement.inspectionreport.entity.InspectionReports;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for InspectionReports entity.
 * Author: sachin
 */
@Repository
public interface InspectionReportsRepository extends JpaRepository<InspectionReports, Integer> {

	List<InspectionReports> findByCombinedEnquiry_Id(Integer combinedEnqId);

}
