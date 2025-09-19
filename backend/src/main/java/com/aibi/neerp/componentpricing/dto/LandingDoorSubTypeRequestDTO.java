package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LandingDoorSubTypeRequestDTO {
    private String subType;
    private int operatorTypeId;
    private int doorTypeId;
    private Double price;     // or BigDecimal
    private Integer size;     // instead of String
}
