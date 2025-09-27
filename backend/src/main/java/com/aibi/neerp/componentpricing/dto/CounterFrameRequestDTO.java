package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CounterFrameRequestDTO {

    @NotNull(message = "Counter Frame Type (Wire Rope) ID is required")
    private Integer counterFrameTypeId;

    @NotNull(message = "Capacity Type ID is required")
    private Integer capacityTypeId;

    private Integer personCapacityId; // optional

    private Integer weightId; // optional

    @NotNull(message = "Operator Type ID is required")
    private Integer operatorTypeId;

    @NotNull(message = "Price is required")
    @Min(value = 1, message = "Price must be greater than 0")
    private Integer price;
}