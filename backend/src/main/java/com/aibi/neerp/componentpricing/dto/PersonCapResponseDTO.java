package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonCapResponseDTO {
    private Integer id;
    private Integer personCount;
    private String label;
    private Integer individualWeight;
    private Integer unitId;
    private Integer capacityTypeId;
    private String displayName;

    public PersonCapResponseDTO() {
    }

    public PersonCapResponseDTO(Integer id, Integer personCount, String label, Integer individualWeight,
                                Integer unitId, Integer capacityTypeId, String displayName) {
        this.id = id;
        this.personCount = personCount;
        this.label = label;
        this.individualWeight = individualWeight;
        this.unitId = unitId;
        this.capacityTypeId = capacityTypeId;
        this.displayName = displayName;
    }

}
