package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HarnessRequestDTO {

    @NotBlank(message = "Harness name cannot be blank")
    private String name;

    @NotNull(message = "Harness price cannot be null")
    @Min(value = 1, message = "Harness price must be greater than 0")
    private Integer price;

    @NotNull(message = "Floor ID must be provided")
    private Integer floorId; // will be mapped to Floor entity
}
