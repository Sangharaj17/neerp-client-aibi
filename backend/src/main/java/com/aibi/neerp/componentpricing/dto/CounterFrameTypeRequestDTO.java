package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CounterFrameTypeRequestDTO {

    @NotBlank(message = "Frame Type Name is required")
    private String frameTypeName;
}
