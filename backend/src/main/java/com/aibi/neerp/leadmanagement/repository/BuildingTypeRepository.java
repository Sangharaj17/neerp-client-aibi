package com.aibi.neerp.leadmanagement.repository;

import com.aibi.neerp.leadmanagement.entity.BuildingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuildingTypeRepository extends JpaRepository<BuildingType, Integer> {
}
