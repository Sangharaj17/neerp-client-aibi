package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LopSubTypeRequestDTO {

    private Integer id;

    @NotBlank(message = "LOP SubType name cannot be blank")
    private String name;

    @NotNull(message = "Price cannot be null")
    @Min(value = 1, message = "Price must be greater than 0")
    private Integer price;

    @NotNull(message = "Floor ID must be provided")
    private Integer floorId;

    @NotNull(message = "LOP Type ID must be provided")
    private Integer lopTypeId;

    @NotNull(message = "Operator Type ID must be provided")
    private Integer operatorTypeId;
}