package com.aibi.neerp.userresource.repository;

import com.aibi.neerp.userresource.entity.TaxType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaxTypeRepository extends JpaRepository<TaxType, Integer> {
    boolean existsByTaxName(String taxName);
}

