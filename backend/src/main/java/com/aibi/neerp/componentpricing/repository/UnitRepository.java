package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface UnitRepository extends JpaRepository<Unit, Integer> {
    Collection<Object> findByUnitNameIgnoreCase(String kg);
}
