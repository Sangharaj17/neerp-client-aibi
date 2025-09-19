package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GovernorRopeRequestDTO {

    @NotBlank(message = "Governor name is required")
    private String governorName;

    @NotNull(message = "Prize is mandatory")
    @Min(value = 1, message = "Prize must be greater than 0")
    private Integer price;

    @NotNull(message = "Floor ID is required")
    private Integer floorId;

    @NotBlank(message = "Quantity cannot be blank")
    private String quantity;
}
