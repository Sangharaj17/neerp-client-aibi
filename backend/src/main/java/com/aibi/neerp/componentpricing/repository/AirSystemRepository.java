package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.AirSystem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AirSystemRepository extends JpaRepository<AirSystem, Integer> {
    List<AirSystem> findByAirType_Id(Integer id);
}
