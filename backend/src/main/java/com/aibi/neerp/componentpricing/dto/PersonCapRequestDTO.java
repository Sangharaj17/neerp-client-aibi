package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PersonCapRequestDTO {
    private Integer personCount;
    private String label;
    private Integer individualWeight;
    private Integer unitId;
    private Integer capacityTypeId;

    public PersonCapRequestDTO() {
    }

    public PersonCapRequestDTO(Integer personCount, String label, Integer individualWeight,
                               Integer unitId, Integer capacityTypeId) {
        this.personCount = personCount;
        this.label = label;
        this.individualWeight = individualWeight;
        this.unitId = unitId;
        this.capacityTypeId = capacityTypeId;
    }

}
