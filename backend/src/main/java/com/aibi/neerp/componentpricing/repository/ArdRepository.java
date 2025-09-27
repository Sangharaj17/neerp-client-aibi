package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Ard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArdRepository extends JpaRepository <Ard, Integer>{
    List<Ard> findAllByOrderByArdDeviceAsc();

    List<Ard> findAllByOrderByIdAsc();

    List<Ard> findByOperatorElevator_IdAndCapacityType_Id(Integer operatorId, Integer capacityTypeId);

    List<Ard> findByOperatorElevator_IdAndCapacityType_IdAndPersonCapacity_Id(Integer operatorId, Integer capacityTypeId, Integer personCapacityId);

    List<Ard> findByOperatorElevator_IdAndCapacityType_IdAndWeight_Id(Integer operatorId, Integer capacityTypeId, Integer weightId);
}
