package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.OtherMaterial;
import com.aibi.neerp.componentpricing.entity.OtherMaterialMain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface OtherMaterialRepository extends JpaRepository<OtherMaterial, Integer> {

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

    @Query("""
                SELECT o 
                FROM OtherMaterial o 
                WHERE o.operatorType.id = :operatorId
                  AND o.capacityType.id = :capacityTypeId
                  AND (
                        (:capacityTypeId = 1 AND o.personCapacity.id = :capacityValueId)
                     OR (:capacityTypeId = 2 AND o.weight.id = :capacityValueId)
                  )
                  AND o.machineRoom.id = :machineRoomId
                  AND LOWER(o.otherMaterialMain.materialMainType) = LOWER(:mainType)
            """)
    List<OtherMaterial> findByOperatorTypeIdAndCapacityTypeIdAndCapacityValueAndMachineRoomIdAndMainType(
            @Param("operatorId") Integer operatorId,
            @Param("capacityTypeId") Integer capacityTypeId,
            @Param("capacityValueId") Integer capacityValueId,
            @Param("machineRoomId") Integer machineRoomId,
            @Param("mainType") String mainType
    );

    // OtherMaterialRepository (or whichever repository file this query is in)

    // Updated Query with floors filter
    @Query("""
                SELECT o 
                FROM OtherMaterial o 
                WHERE o.operatorType.id = :operatorId
                  AND o.capacityType.id = :capacityTypeId
                  AND (
                        (:capacityTypeId = 1 AND o.personCapacity.id = :capacityValueId)
                     OR (:capacityTypeId = 2 AND o.weight.id = :capacityValueId)
                  )
                  AND o.machineRoom.id = :machineRoomId
                  AND o.floors.id = :floorsId 
                  AND LOWER(o.otherMaterialMain.materialMainType) = LOWER(:mainType)
            """)
    List<OtherMaterial> findByOperatorTypeIdAndCapacityTypeIdAndCapacityValueAndMachineRoomIdAndFloorsAndMainType(
            @Param("operatorId") Integer operatorId,
            @Param("capacityTypeId") Integer capacityTypeId,
            @Param("capacityValueId") Integer capacityValueId,
            @Param("machineRoomId") Integer machineRoomId,
            @Param("floorsId") Integer floorsId,
            @Param("mainType") String mainType
    );

    Optional<OtherMaterial> findByOtherMaterialMain_MaterialMainType(String materialMainType);

    List<OtherMaterial> findByOtherMaterialMainId(Long otherMaterialMainId);

    boolean existsByOtherMaterialNameIgnoreCase(String truffing);

    boolean existsByOtherMaterialMainAndOtherMaterialNameIgnoreCase(OtherMaterialMain main, String materialName);

    @Query("SELECT o FROM OtherMaterial o " +
            "WHERE o.operatorType.id = :operatorId " +
            "AND LOWER(o.otherMaterialMain.materialMainType) <> 'others'")
    List<OtherMaterial> findByOperatorIdExcludingOthers(@Param("operatorId") Integer operatorId);

//    @Query("SELECT o FROM OtherMaterial o WHERE LOWER(o.otherMaterialMain.materialMainType) LIKE LOWER(CONCAT('%', :keyword, '%'))")
//    List<OtherMaterial> findByMainTypeContainingIgnoreCase(@Param("keyword") String keyword);

//    List<OtherMaterial> findByOperatorTypeIdAndOtherMaterialMain_MaterialMainTypeContainingIgnoreCase(Integer operatorId, String keyword);

    List<OtherMaterial> findByOtherMaterialMain_MaterialMainTypeContainingIgnoreCaseAndOperatorTypeIsNull(String mainType);

    List<OtherMaterial> findByOtherMaterialMain_MaterialMainTypeContainingIgnoreCaseAndOperatorType_Id(String mainType, Integer operatorId);

}
