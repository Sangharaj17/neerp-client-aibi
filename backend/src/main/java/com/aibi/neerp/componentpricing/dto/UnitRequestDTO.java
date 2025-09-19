package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UnitRequestDTO {
    private String unitName;
    private String description;

    public UnitRequestDTO() {
    }

    public UnitRequestDTO(String unitName, String description) {
        this.unitName = unitName;
        this.description = description;
    }

}

