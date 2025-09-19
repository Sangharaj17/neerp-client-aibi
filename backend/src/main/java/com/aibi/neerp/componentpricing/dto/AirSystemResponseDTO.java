package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AirSystemResponseDTO {
    private int id;
    //private String airSystemName;
    private int price;
    private String quantity;

    private Integer capacityTypeId;
    private String capacityTypeName;

    private Integer personCapacityId;
    private String personCapacityName;

    private Integer weightId;
    private String weightName;

    private Integer airTypeId;
    private String airTypeName;
}
