package com.aibi.neerp.componentpricing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class BracketResponseDTO {
    private int id;
    private String bracketTypeName;
    private Integer price;
    private String floorName;
}
