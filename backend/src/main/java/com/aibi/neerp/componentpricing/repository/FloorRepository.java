package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface FloorRepository extends JpaRepository<Floor, Long> {
    boolean existsByFloorName(String floorName);

    @Modifying
    @Query(value = "ALTER SEQUENCE tbl_floor_id_seq RESTART WITH 1", nativeQuery = true)
    void resetSequence();

}
