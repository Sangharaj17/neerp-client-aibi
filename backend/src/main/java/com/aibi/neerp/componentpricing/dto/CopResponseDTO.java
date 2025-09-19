package com.aibi.neerp.componentpricing.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CopResponseDTO {
    private int id;
    private String copName;
    private Integer price;
    private String copType;
    private String floorName;
    private String operatorTypeName;
}
