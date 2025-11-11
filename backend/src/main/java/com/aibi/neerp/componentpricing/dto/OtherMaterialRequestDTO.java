package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OtherMaterialRequestDTO {

    @NotNull(message = "Other Material Name is required")
    private String otherMaterialName;

    @NotNull(message = "Material Main type is required")
    private Long otherMaterialMainId;

    private Integer operatorTypeId;
    private Integer machineRoomId;

//    @NotNull(message = "Capacity type is required")
    private Integer capacityTypeId;

    private Integer personCapacityId;
    private Integer weightId;
    private Integer floorsId;

    @NotNull(message = "Quantity is required")
    private String quantity;

    @NotNull(message = "Price is required")
    private Integer price;
}
