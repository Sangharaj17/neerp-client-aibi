package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.OtherMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface OtherMaterialRepository extends JpaRepository<OtherMaterial, Integer> {
    Optional<OtherMaterial> findByMaterialType(String truffing);
}
