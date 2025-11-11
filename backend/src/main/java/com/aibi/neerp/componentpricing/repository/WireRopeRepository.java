package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.WireRope;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface WireRopeRepository extends JpaRepository<WireRope, Integer> {
    List<WireRope> findByFloor_Id(Long floorId);

    List<WireRope> findByFloor_IdAndOperatorElevator_Id(Long floorId, Long operatorTypeId);
}
