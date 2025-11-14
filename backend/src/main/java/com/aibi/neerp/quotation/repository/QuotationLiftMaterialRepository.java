package com.aibi.neerp.quotation.repository;

import com.aibi.neerp.quotation.entity.QuotationLiftMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuotationLiftMaterialRepository extends JpaRepository<QuotationLiftMaterial, Long> {
    Optional<QuotationLiftMaterial> findById(Long id);
}
