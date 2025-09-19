package com.aibi.neerp.componentpricing.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WireRopeResponseDTO {
    private Integer id;
    private String wireRopeTypeName;
    private String operatorElevatorName;
    private String floorName;
    private Integer wireRopeQty;
    private Integer price;
}
