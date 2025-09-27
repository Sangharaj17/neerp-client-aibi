package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.AirSystem;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AirSystemRepository extends JpaRepository<AirSystem, Integer> {
    List<AirSystem> findByAirType_Id(Integer id);

    @Query("""
                SELECT a 
                FROM AirSystem a
                WHERE a.airType.id = :airTypeId
                  AND a.capacityType.id = :capacityTypeId
                  AND (
                        (:personId IS NOT NULL AND a.personCapacity.id = :personId)
                     OR (:weightId IS NOT NULL AND a.weight.id = :weightId)
                  )
            """)
    Optional<AirSystem> findByAirType_IdAndCapacityType_IdAndPersonCapacity_IdOrWeight_Id(
            @Param("airTypeId") Integer airTypeId,
            @Param("capacityTypeId") Integer capacityTypeId,
            @Param("personId") Integer personId,
            @Param("weightId") Integer weightId
    );

}