package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Floor;
import com.aibi.neerp.componentpricing.entity.GovernorRope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GovernorRopeRepository extends JpaRepository<GovernorRope, Integer> {
    List<GovernorRope> findByFloor(Floor floor);
    List<GovernorRope> findByFloor_FloorNameIgnoreCase(String floorName);
}
