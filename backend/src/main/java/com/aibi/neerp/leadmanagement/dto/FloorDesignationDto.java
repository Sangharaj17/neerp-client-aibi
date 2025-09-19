package com.aibi.neerp.leadmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FloorDesignationDto {
    private Integer floorDesignationId;

    @NotBlank(message = "Floor designation name must not be blank")
    private String name;
}
