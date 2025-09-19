package com.aibi.neerp.materialmanagement.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonCapacityDto {
    private Integer id;
    private Integer personCount;
    private String text;
    private Integer weight;
    private String unit;
}
