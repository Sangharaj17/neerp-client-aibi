package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CounterWeightRequestDTO {

    private String counterWeightName;

    @NotNull(message = "Counter Weight Type is required")
    private Integer counterWeightTypeId;

    @NotNull(message = "Floors is required")
    private Integer floorsId;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be a positive number")
    private Integer price;
}
