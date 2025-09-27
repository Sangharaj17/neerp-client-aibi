package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.LandingDoorSubType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LandingDoorSubTypeRepository extends JpaRepository<LandingDoorSubType, Integer> {
    List<LandingDoorSubType> findByLandingDoorType_DoorTypeId(int id);

    // 🔹 New method to search by operatorElevator id (liftType)
    List<LandingDoorSubType> findByOperatorElevator_Id(Integer operatorElevatorId);

}