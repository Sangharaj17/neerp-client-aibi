package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_type_of_lift")
@Getter
@Setter
public class TypeOfLift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lift_type_id")
    private int id;

    @NotBlank(message = "Lift type name cannot be blank")
    @Column(name = "lift_type_name", nullable = false)
    private String liftTypeName;
}
