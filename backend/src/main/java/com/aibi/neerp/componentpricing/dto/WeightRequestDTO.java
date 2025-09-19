package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeightRequestDTO {
    private Integer unitId;
    private Integer weightValue;
    private Integer capacityTypeId;

    public WeightRequestDTO() {}

    public WeightRequestDTO(Integer unitId, Integer weightValue, Integer capacityTypeId) {
        this.unitId = unitId;
        this.weightValue = weightValue;
        this.capacityTypeId = capacityTypeId;
    }
}
