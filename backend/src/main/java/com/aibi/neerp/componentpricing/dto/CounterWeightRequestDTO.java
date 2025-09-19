package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CounterWeightRequestDTO {

    private String counterFrameName;

    @NotNull(message = "Type of Lift is required")
    private Integer typeOfLiftId;

    @NotNull(message = "Counter Frame Type is required")
    private Integer counterFrameTypeId;

    @NotNull(message = "Floors is required")
    private Integer floorsId;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be a positive number")
    private Integer price;
}
