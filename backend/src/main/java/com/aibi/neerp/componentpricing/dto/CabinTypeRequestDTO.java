package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CabinTypeRequestDTO {

    @NotBlank(message = "Cabin type name is required")
    private String cabinType;

}

