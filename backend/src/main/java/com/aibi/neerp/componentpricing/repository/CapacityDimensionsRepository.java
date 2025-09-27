package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.CapacityDimensions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CapacityDimensionsRepository extends JpaRepository<CapacityDimensions, Integer> {
    CapacityDimensions findByPersonCapacity_Id(Integer personCapacityId);
    Optional<CapacityDimensions> findByCapacityTypeIdAndPersonCapacityId(Integer capacityTypeId, Integer personCapacityId);

    Optional<CapacityDimensions> findByCapacityTypeIdAndWeightId(Integer capacityTypeId, Integer weightId);
}
