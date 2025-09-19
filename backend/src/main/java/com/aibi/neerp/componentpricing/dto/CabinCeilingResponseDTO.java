package com.aibi.neerp.componentpricing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CabinCeilingResponseDTO {
    private Integer ceilingId;
    private String ceilingName;
    private int price;
}
