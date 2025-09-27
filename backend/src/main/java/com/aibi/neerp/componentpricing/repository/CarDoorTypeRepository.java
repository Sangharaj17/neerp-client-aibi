package com.aibi.neerp.componentpricing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aibi.neerp.componentpricing.entity.CarDoorType;

import java.util.List;

public interface CarDoorTypeRepository extends JpaRepository< CarDoorType, Integer> {

    List<CarDoorType> findByOperatorElevator_Id(Integer operatorElevatorId);
}
