package com.aibi.neerp.componentpricing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CarDoorTypeResponseDTO {
    private int id;
    private String carDoorType;
    private int operatorElevatorId;
    private String operatorElevatorName; // Assuming there's a name field
}
