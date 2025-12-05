package com.aibi.neerp.leadmanagement.inspectionreport.repository;

import com.aibi.neerp.leadmanagement.inspectionreport.entity.InspectionCategoryCheckpoint;
import com.aibi.neerp.leadmanagement.inspectionreport.entity.InspectionReportCategory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InspectionCategoryCheckpointRepository extends JpaRepository<InspectionCategoryCheckpoint, Integer> {

	List<InspectionCategoryCheckpoint> findByCategory(InspectionReportCategory category);

	List<InspectionCategoryCheckpoint> findByCategoryId(Integer categoryId);
}
