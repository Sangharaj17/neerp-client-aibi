package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeightResponseDTO {
    private Integer id;
    private Integer unitId;
    private Integer weightValue;
    private Integer capacityTypeId;

    public WeightResponseDTO() {}

    public WeightResponseDTO(Integer id, Integer unitId, Integer weightValue, Integer capacityTypeId) {
        this.id = id;
        this.unitId = unitId;
        this.weightValue = weightValue;
        this.capacityTypeId = capacityTypeId;
    }
}
