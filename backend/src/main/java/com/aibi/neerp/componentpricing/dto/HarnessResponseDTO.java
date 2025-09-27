package com.aibi.neerp.componentpricing.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class HarnessResponseDTO {
    private int id;
    private String name;
    private Integer price;
    private String floorName; // Derived from Floor entity
    private Integer floorId;
}
