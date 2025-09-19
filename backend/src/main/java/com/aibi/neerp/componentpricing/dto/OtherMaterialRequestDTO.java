package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OtherMaterialRequestDTO {

    @NotBlank(message = "Material type is required")
    private String materialType;

    private Integer operatorTypeId;
    private Integer machineRoomId;

    @NotNull(message = "Capacity type is required")
    private Integer capacityTypeId;

    private Integer personCapacityId;
    private Integer weightId;
    private Integer floorsId;

    @NotBlank(message = "Quantity is required")
    private String quantity;

    @NotNull(message = "Price is required")
    private Integer price;
}
