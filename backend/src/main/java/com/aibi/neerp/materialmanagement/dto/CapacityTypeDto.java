package com.aibi.neerp.materialmanagement.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CapacityTypeDto {
    private Integer id;
    private String capacityType;
    private String tableName;
}
