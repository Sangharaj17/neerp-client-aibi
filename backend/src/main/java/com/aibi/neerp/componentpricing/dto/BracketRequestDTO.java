package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BracketRequestDTO {

    @NotNull(message = "Bracket Type ID is mandatory")
    private Integer bracketTypeId;

    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be greater than zero")
    private Integer price;

    @NotNull(message = "Floor ID is mandatory")
    private Integer floorId;

    public void sanitize() {
        // Escape HTML or dangerous characters if needed
        // In this DTO, only IDs and price are numeric, so no string escaping needed.
    }
}
