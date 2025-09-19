package com.aibi.neerp.leadmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AreaDto {
    private Integer areaId;

    @NotBlank(message = "Area name must not be blank")
    private String areaName;
}
