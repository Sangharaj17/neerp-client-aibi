package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = " tbl_car_door_type")
@Getter
@Setter
public class CarDoorType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int carDoorId;

    @NotBlank(message = "Cabin Door Type cannot be blank")
    private String carDoorType;

    @NotNull(message = "Operator Type must be selected")
    @ManyToOne
    @JoinColumn(name = "operator_type", referencedColumnName = "id")
    private OperatorElevator operatorElevator;
}
