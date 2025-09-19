package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Ard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArdRepository extends JpaRepository <Ard, Integer>{
    List<Ard> findAllByOrderByArdDeviceAsc();

    List<Ard> findAllByOrderByIdAsc();
}
