package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LandingDoorSubTypeResponseDTO {
    private int id;
    private String name;
    private int prize;
    private int size;

    private int operatorTypeId;
    private String operatorTypeName;

    private int landingDoorTypeId;
    private String landingDoorTypeName;
}

