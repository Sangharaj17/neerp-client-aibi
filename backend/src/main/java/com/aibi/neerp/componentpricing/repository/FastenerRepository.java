package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Fastener;
import com.aibi.neerp.componentpricing.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FastenerRepository extends JpaRepository<Fastener, Integer> {

    Optional<Fastener> findByFastenerNameAndFloor(String fastenerName, Floor floor);

    boolean existsByFastenerNameAndFloor(String fastenerName, Floor floor);

    List<Fastener> findByFloor(Floor floor);
}
