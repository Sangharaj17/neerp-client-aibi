package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BracketTypeRequestDTO {

    @NotBlank(message = "Bracket Type name cannot be blank")
    private String name; // Example: "GP BRACKET"

}
