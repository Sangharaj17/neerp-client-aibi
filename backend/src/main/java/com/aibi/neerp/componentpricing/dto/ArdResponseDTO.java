package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArdResponseDTO {
    private int id;
    private String ardDevice;
    private Integer price;

    private Integer capacityTypeId;
    private String capacityTypeName;

    private Integer personCapacityId;
    private String personCapacityName;

    private Integer weightId;
    private String weightName;

    private Integer operatorElevatorId;
    private String operatorElevatorName;


}
