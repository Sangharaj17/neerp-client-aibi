package com.aibi.neerp.componentpricing.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GovernorRopeResponseDTO {
    private int id;
    private String governorName;
    private Integer price;
    private String floorName;
    private String quantity;
}
