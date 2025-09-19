package com.aibi.neerp.leadmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_building_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuildingType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "building_type_id")
    private Integer buildingTypeId;

    @Column(name = "building_type", nullable = false, length = 255)
    private String buildingType;
}
