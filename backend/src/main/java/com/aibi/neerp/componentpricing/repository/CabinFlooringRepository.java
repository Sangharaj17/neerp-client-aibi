package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.CabinFlooring;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CabinFlooringRepository extends JpaRepository<CabinFlooring, Integer> {

    boolean existsByFlooringName(String flooringName);

    CabinFlooring findByFlooringName(String flooringName);
}
