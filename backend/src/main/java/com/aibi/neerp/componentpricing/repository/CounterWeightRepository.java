package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.CounterWeight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface CounterWeightRepository extends JpaRepository<CounterWeight, Integer> {
    List<CounterWeight> findByFloors_Id(Long floorId);
}
