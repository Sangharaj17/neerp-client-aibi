package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AirSystemRequestDTO {

//    @NotBlank(message = "Air System name cannot be blank")
//    private String airSystemName;

    @NotNull(message = "Capacity Type is required")
    private Integer capacityTypeId;

    private Integer personId; // Optional if weight is used
    private Integer weightId;         // Optional if person capacity is used

    @NotNull(message = "Price is required")
    private Integer price;

    @NotNull(message = "Air Type is required")
    private Integer airTypeId;

    private String quantity; // Optional
}
