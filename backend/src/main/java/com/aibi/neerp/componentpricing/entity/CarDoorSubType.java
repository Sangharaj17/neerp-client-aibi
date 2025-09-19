package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_car_door_subtype")
@Getter
@Setter
public class CarDoorSubType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Car Door SubType cannot be blank")
    private String carDoorSubtype;

    @NotNull(message = "Operator Type must be selected")
    @ManyToOne
    @JoinColumn(name = "operator_type", referencedColumnName = "id")
    private OperatorElevator operatorElevator;

    @NotNull(message = "Car door prize cannot be null")
    @Min(value = 1, message = "Car door prize must be greater than 0")
    private int price;

    @NotNull(message = "Car door Type must be selected")
    @ManyToOne
    @JoinColumn(name = "car_door_type", referencedColumnName = "carDoorId")
    private CarDoorType carDoorType;

    private int size;

}
