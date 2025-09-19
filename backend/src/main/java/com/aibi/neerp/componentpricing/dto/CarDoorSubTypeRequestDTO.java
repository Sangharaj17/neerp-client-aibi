package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarDoorSubTypeRequestDTO {

    private Integer carDoorSubTypeId;

    @NotBlank(message = "Car Door SubType is required")
    private String carDoorSubType;

    @NotNull(message = "Operator Elevator ID is required")
    private Integer operatorElevatorId;

    @NotNull(message = "Car Door Type ID is required")
    private Integer carDoorTypeId;

    @NotNull(message = "Prize must be specified")
    @Min(value = 1, message = "Prize must be greater than 0")
    private Integer price;

    private Integer size;
}
