package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.MachineRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MachineRoomRepository extends JpaRepository<MachineRoom, Integer> {
    boolean existsByMachineRoomNameIgnoreCase(String machineRoomName);
}
