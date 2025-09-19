package com.aibi.neerp.componentpricing.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CounterWeightResponseDTO {

    private Integer id;
    private String counterFrameName;
    private String typeOfLiftName;
    private String counterFrameTypeName;
    private String floorName;
    private Integer price;
}
