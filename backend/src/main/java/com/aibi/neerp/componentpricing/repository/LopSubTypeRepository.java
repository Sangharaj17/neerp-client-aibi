package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.LopSubType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LopSubTypeRepository extends JpaRepository<LopSubType, Integer> {
    List<LopSubType> findByLopType_Id(Integer lopTypeId);
}

