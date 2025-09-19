package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class NewCounterWeightRequestDTO {

    @NotBlank(message = "Counter Weight name cannot be blank")
    private String newCounterWeightName;

    @NotNull(message = "Capacity Type must be selected")
    private Integer capacityTypeId;

    // Optional depending on capacity type
    private Integer personCapacityId; // nullable

    // Optional depending on capacity type
    private Integer weightId;         // nullable

    @NotBlank(message = "Quantity cannot be blank")
    private String quantity;

    @NotNull(message = "Price cannot be null")
    @Min(value = 1, message = "Price must be greater than 0")
    private Integer price;
}
