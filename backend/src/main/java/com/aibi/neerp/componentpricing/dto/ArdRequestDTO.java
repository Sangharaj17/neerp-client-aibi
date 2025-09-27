package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArdRequestDTO {

    @NotBlank(message = "ARD Type cannot be blank")
    private String ardDevice;

    @NotNull(message = "Price cannot be null")
    @Min(value = 1, message = "Price must be greater than 0")
    private Integer price;

    @NotNull(message = "Capacity Type ID is required")
    private Integer capacityTypeId;

    private Integer personCapacityId;
    private Integer weightId;

    @NotNull(message = "Operator Type ID is required")
    private Integer operatorElevatorId;

}
