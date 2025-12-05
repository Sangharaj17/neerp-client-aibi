package com.aibi.neerp.leadmanagement.inspectionreport.repository;

import com.aibi.neerp.leadmanagement.inspectionreport.entity.InspectionCheckpointStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InspectionCheckpointStatusRepository extends JpaRepository<InspectionCheckpointStatus, Integer> {
}
