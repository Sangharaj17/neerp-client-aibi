package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class FloorRequestDTO {
    private int id;
    @Min(value = 1, message = "Total floors must be at least 1")
    private int totalFloors;

    @NotBlank(message = "Prefix is required")
    private String prefix;
}
