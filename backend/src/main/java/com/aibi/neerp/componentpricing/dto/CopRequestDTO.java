package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CopRequestDTO {

    @NotBlank(message = "COP Name cannot be blank")
    private String copName;

    @NotNull(message = "Operator Type ID is mandatory")
    private Integer operatorTypeId;

    @NotNull(message = "Floor ID is mandatory")
    private Integer floorId;

    private Integer price;

    private String copType;
}
