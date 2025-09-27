package com.aibi.neerp.componentpricing.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WireRopeResponseDTO {
    private Integer id;
    private Integer wireRopeTypeId;
    private String wireRopeTypeName;
    private Integer operatorElevatorId;
    private String operatorElevatorName;
    private Integer floorId;
    private String floorName;
    private Integer wireRopeQty;
    private Integer price;
}
