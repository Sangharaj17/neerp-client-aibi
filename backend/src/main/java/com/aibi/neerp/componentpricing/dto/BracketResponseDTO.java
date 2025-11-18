package com.aibi.neerp.componentpricing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class BracketResponseDTO {
    private int id;
    private Integer bracketTypeId;
    private String bracketTypeName;
    private String carBracketSubType;
    private Integer price;
    private Integer floorId;
    private String floorName;
}
