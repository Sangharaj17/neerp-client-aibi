package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_landing_door_subtype")
@Getter
@Setter
public class LandingDoorSubType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Landing Door SubType cannot be blank")
    private String name;

    @NotNull(message = "Operator Type must be selected")
    @ManyToOne
    @JoinColumn(name = "operator_type", referencedColumnName = "id")
    private OperatorElevator operatorElevator;

    @NotNull(message = "Landing Door SubType prize cannot be null")
    @Min(value = 1, message = "Landing Door SubType prize must be greater than 0")
    private int prize;

    @NotNull(message = "Landing Door Type must be selected")
    @ManyToOne
    @JoinColumn(name = "main_door_type", referencedColumnName = "doorTypeId")
    private LandingDoorType landingDoorType;

    private int size;
}
