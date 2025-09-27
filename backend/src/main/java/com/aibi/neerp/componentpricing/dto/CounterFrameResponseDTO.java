package com.aibi.neerp.componentpricing.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CounterFrameResponseDTO {
    private Integer id;
    private Integer price;

    // Related names for frontend display
    private Integer counterFrameTypeId;
    private String counterFrameTypeName; // from WireRope

    private Integer operatorTypeId;
    private String operatorTypeName;

    private Integer capacityTypeId;
    private String capacityTypeName;

    private Integer personCapacityId;
    private String personCapacityName;

    private Integer weightId;
    private String weightName;
}