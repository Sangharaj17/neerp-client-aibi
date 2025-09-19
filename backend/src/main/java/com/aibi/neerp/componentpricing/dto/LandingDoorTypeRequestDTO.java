package com.aibi.neerp.componentpricing.dto
        ;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LandingDoorTypeRequestDTO {
    @NotBlank(message = "Door Type is required")
    private String doorType;

    @NotNull(message = "Operator Type ID is required")
    private Integer operatorTypeId;
}
