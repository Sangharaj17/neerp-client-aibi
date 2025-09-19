package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;

@Getter
public class CabinTypeResponseDTO {

    private int id;
    private String cabinType;

    public CabinTypeResponseDTO(int id, String cabinType) {
        this.id = id;
        this.cabinType = cabinType;
    }

}
