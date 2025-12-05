package com.aibi.neerp.leadmanagement.inspectionreport.repository;

import com.aibi.neerp.leadmanagement.inspectionreport.entity.InspectionReportRepeatLift;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InspectionReportRepeatLiftRepository extends JpaRepository<InspectionReportRepeatLift, Integer> {

	List<InspectionReportRepeatLift> findByInspectionReports_Id(Integer id);
}
