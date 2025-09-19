package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ControlPanelTypeRequestDTO {

    @NotBlank(message = "Control panel type name cannot be blank")
    private String controlPanelType;

    @NotNull(message = "Machine type ID must be provided")
    private Integer machineTypeId;

    @NotNull(message = "Operator type ID must be provided")
    private Integer operatorTypeId;

    @NotNull(message = "Capacity type ID must be provided")
    private Integer capacityTypeId;

    private Integer personCapacityId; // optional
    private Integer weightId;         // optional

    private Integer price;
}
