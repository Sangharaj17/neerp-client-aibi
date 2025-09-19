package com.aibi.neerp.componentpricing.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LopSubTypeResponseDTO {
    private Integer id;
    private String name;
    private Double price;
    private Integer floorId;
    private String floorName;
    private Integer lopTypeId;
    private String lopTypeName;
    private Integer operatorTypeId;
    private String operatorTypeName;
}
