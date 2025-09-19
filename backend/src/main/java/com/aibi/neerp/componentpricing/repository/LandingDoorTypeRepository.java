package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.LandingDoorType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LandingDoorTypeRepository extends JpaRepository<LandingDoorType, Integer> {
    List<LandingDoorType> findByOperatorElevator_Id(int operatorTypeId);
}
