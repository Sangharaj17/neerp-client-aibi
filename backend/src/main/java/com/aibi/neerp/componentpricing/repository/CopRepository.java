package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Cop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CopRepository extends JpaRepository<Cop, Integer> {
    boolean existsByCopNameIgnoreCaseAndFloor_IdAndOperatorType_Id(String copName, Integer floorId, Integer operatorTypeId);
    boolean existsByCopNameIgnoreCaseAndFloor_IdAndOperatorType_IdAndIdNot(String copName, Integer floorId, Integer operatorTypeId, Integer id);
}
