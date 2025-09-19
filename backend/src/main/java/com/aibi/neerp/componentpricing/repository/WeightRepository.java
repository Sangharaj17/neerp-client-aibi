package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Weight;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WeightRepository extends JpaRepository<Weight, Integer> {

    boolean existsByUnitIdAndWeightValueAndCapacityTypeId(Integer unitId, Integer weightValue, Integer capacityTypeId);
}
