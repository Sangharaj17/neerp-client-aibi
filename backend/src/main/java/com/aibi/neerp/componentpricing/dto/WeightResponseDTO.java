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
    private String unitNM;
    private String weightFull;

    public WeightResponseDTO() {}

//    public WeightResponseDTO(Integer id, Integer id1, Integer weightValue, Integer id2, String unitName, String s) {
//    }

    public WeightResponseDTO(Integer id, Integer unitId, Integer weightValue, Integer capacityTypeId, String unitNM, String weightFull) {
        this.id = id;
        this.unitId = unitId;
        this.weightValue = weightValue;
        this.capacityTypeId = capacityTypeId;
        this.unitNM = unitNM;
        this.weightFull = weightFull;
    }
}
