package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AirTypeRequestDTO {
    private Integer id;

    @NotBlank(message = "Air Type name cannot be blank")
    private String name;

    private Boolean status = true; // Optional, default active
}
