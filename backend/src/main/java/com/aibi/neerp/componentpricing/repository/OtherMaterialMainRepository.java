package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.OtherMaterialMain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtherMaterialMainRepository extends JpaRepository<OtherMaterialMain, Long> {
    boolean existsByMaterialMainTypeIgnoreCase(String materialMainType);
    Optional<OtherMaterialMain> findByMaterialMainTypeIgnoreCase(String materialMainType);
}
