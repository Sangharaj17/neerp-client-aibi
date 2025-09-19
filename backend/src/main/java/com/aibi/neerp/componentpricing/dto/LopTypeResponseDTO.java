package com.aibi.neerp.componentpricing.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LopTypeResponseDTO {
    private Integer lopTypeId;
    private String lopType;
    private Integer operatorTypeId;
    private String operatorTypeName;
}