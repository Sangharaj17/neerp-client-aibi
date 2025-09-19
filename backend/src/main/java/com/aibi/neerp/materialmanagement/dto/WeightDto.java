package com.aibi.neerp.materialmanagement.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WeightDto {
    private Integer id;
    private Integer weightValue;
    private String unit;
}
