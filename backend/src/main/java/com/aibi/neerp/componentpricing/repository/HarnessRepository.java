package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Harness;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface HarnessRepository extends JpaRepository <Harness, Integer> {
    List<Harness> findByFloor_FloorNameIgnoreCase(String floorName);
}
