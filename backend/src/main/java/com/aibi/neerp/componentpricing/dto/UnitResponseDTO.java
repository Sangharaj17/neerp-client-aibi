package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UnitResponseDTO {
    private Integer id;
    private String unitName;
    private String description;

    public UnitResponseDTO() {}

    public UnitResponseDTO(Integer id, String unitName, String description) {
        this.id = id;
        this.unitName = unitName;
        this.description = description;
    }

}

