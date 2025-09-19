package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CapacityTypeRequestDTO {

    @NotBlank(message = "Type must not be empty")
    private String type;

    public CapacityTypeRequestDTO() {
    }

    public CapacityTypeRequestDTO(String type) {
        this.type = type;
    }
}
