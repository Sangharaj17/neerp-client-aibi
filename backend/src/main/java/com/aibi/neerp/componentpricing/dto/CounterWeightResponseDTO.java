package com.aibi.neerp.componentpricing.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CounterWeightResponseDTO {

    private Integer id;
    private String counterWeightName;
    private Integer counterWeightTypeId;
    private String counterWeightTypeName;
//    private Integer operatorTypeId;
//    private String operatorTypeName;
    private Integer floorId;
    private String floorName;
    private Integer price;
}
