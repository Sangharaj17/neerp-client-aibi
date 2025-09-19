package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LopTypeRequestDTO {

    private Integer id;

    @NotBlank(message = "LOP Type cannot be blank")
    private String lopType;

    @NotNull(message = "Operator Type ID must be provided")
    private Integer operatorTypeId;
}