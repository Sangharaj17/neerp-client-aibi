package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_air_type")
@Getter
@Setter
public class AirType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Air Type name cannot be blank")
    private String name;

    private boolean status = true; // Default: In Use (Active)
}
