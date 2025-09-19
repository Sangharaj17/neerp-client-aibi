package com.aibi.neerp.componentpricing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CarDoorSubTypeResponseDTO {
    private int id;
    private String carDoorSubType;
    private int operatorElevatorId;
    private String operatorElevatorName;    // <=== this must exist
    private int carDoorTypeId;
    private String carDoorTypeName;
    private int price;
    private int size;
}
