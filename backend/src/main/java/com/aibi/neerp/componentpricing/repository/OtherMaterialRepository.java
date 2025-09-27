package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.OtherMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface OtherMaterialRepository extends JpaRepository<OtherMaterial, Integer> {
    Optional<OtherMaterial> findByMaterialType(String truffing);

    @Query("SELECT o FROM OtherMaterial o " +
            "WHERE o.operatorType.id = :operatorId " +
            "AND o.capacityType.id = :capacityTypeId " +
            "AND (:capacityTypeId = 1 AND o.personCapacity.id = :capacityValueId " +
            "   OR :capacityTypeId = 2 AND o.weight.id = :capacityValueId) " +
            "AND o.machineRoom.id = :machineRoomId")
    List<OtherMaterial> findByOperatorTypeIdAndCapacityTypeIdAndCapacityValueAndMachineRoomId(
            @Param("operatorId") Integer operatorId,
            @Param("capacityTypeId") Integer capacityTypeId,
            @Param("capacityValueId") Integer capacityValueId,
            @Param("machineRoomId") Integer machineRoomId
    );

}
