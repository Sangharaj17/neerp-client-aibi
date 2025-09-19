package com.aibi.neerp.amc.common.repository;

import com.aibi.neerp.amc.common.entity.ElevatorMake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElevatorMakeRepository extends JpaRepository<ElevatorMake, Long> {

    boolean existsByName(String name);
}
