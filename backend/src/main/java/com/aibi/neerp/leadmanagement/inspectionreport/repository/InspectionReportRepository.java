package com.aibi.neerp.leadmanagement.inspectionreport.repository;

import com.aibi.neerp.leadmanagement.inspectionreport.entity.InspectionReport;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InspectionReportRepository extends JpaRepository<InspectionReport, Integer> {

	List<InspectionReport> findByRepeatLift_Id(Integer liftId);
}
