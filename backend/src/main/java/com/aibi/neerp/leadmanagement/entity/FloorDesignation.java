package com.aibi.neerp.leadmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_floor_designation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FloorDesignation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "floor_designation_id")
    private Integer floorDesignationId;

    @Column(name = "name", length = 255, nullable = false)
    private String name;
}
