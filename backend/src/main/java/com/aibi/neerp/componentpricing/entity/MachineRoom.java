package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_machine_room")
@Getter
@Setter
public class MachineRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @NotBlank(message = "Machine Room Name cannot be blank")
    @Column(name = "machine_room_name")
    private String machineRoomName;
}
