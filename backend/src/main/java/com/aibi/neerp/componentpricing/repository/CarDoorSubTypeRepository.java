package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.CarDoorSubType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarDoorSubTypeRepository  extends JpaRepository<CarDoorSubType, Integer> {
    List<CarDoorSubType> findByCarDoorType_CarDoorId(int id);
}
