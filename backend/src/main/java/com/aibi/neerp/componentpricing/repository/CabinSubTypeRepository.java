package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.CabinSubType;
import com.aibi.neerp.componentpricing.entity.CabinType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CabinSubTypeRepository extends JpaRepository<CabinSubType, Integer> {
    boolean existsByCabinSubNameAndCabinType(String sanitizedSubName, CabinType cabinType);

    boolean existsByCabinSubNameAndCabinTypeAndIdNot(String updatedName, CabinType cabinType, Integer id);

    List<CabinSubType> findByCabinType(CabinType cabinType);
}
