package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CounterFrameRequestDTO {

    @NotNull(message = "Counter Frame Type (Wire Rope) ID is required")
    private Integer counterFrameTypeId;

    @NotBlank(message = "Counter Frame Name cannot be blank")
    private String counterFrameName;

    @NotNull(message = "Capacity Type ID is required")
    private Integer capacityTypeId;

    private Integer personCapacityId; // optional

    private Integer weightId; // optional

    @NotNull(message = "Machine Type ID must be selected")
    private Integer machineTypeId;

    @NotNull(message = "Price is required")
    @Min(value = 1, message = "Price must be greater than 0")
    private Integer price;
}