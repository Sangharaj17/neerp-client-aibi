package com.aibi.neerp.componentpricing.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NewCounterWeightResponseDTO {
    private Integer id;
    private String newCounterWeightName;

    private Integer capacityTypeId;
    private String capacityTypeName;

    private Integer personCapacityId;
    private String personCapacityName;

    private Integer weightId;
    private String weightName;

    private String quantity;
    private Integer price;
}
