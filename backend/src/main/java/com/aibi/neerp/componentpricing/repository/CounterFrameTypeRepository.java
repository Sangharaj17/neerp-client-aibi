package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.CounterFrameType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface CounterFrameTypeRepository extends JpaRepository<CounterFrameType, Integer> {

    // For Person capacity type
    List<CounterFrameType> findByCounterFrameType_IdAndCapacityType_IdAndPersonCapacity_IdAndMachineType_Id(
                                                                                                             Integer counterFrameTypeId,
                                                                                                             Integer capacityTypeId,
                                                                                                             Integer personCapacityId,
                                                                                                             Integer machineTypeId
    );

    // For Weight capacity type
    List<CounterFrameType> findByCounterFrameType_IdAndCapacityType_IdAndWeight_IdAndMachineType_Id(
                                                                                                     Integer counterFrameTypeId,
                                                                                                     Integer capacityTypeId,
                                                                                                     Integer weightId,
                                                                                                     Integer machineTypeId
    );

    List<CounterFrameType> findAllByOrderByMachineType_LiftTypeNameAsc();
}
