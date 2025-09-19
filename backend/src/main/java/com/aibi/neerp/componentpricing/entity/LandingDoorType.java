package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = " tbl_landing_door_type")
@Getter
@Setter
public class LandingDoorType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int doorTypeId;

    @NotBlank(message = "Door Type cannot be blank")
    private String doorType;

    @NotNull(message = "Operator Type must be selected")
    @ManyToOne
    @JoinColumn(name = "operator_type", referencedColumnName = "id")
    private OperatorElevator operatorElevator;
}
