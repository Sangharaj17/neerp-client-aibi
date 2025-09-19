package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CabinCeilingRequestDTO {

    private int id;

    @NotBlank(message = "Ceiling Name is required")
    private String ceilingName;

    @Min(value = 1, message = "Prize must be greater than 0")
    private int price;
}
