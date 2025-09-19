package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TypeOfLiftRequestDTO {

    @NotBlank(message = "Lift type name cannot be blank")
    private String liftTypeName;
}
