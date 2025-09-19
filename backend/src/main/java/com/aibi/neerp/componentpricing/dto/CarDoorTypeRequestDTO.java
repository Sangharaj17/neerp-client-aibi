package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarDoorTypeRequestDTO {
    @NotBlank(message = "Car Door Type is required")
    private String carDoorType;

    @NotNull(message = "Operator Elevator ID is required")
    private Integer operatorElevatorId;

    private Integer carDoorId;

}
