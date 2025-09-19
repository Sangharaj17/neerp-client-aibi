package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CabinFlooringRequestDTO {

    private int id;

    @NotBlank(message = "Flooring Name cannot be blank")
    private String flooringName;

    @NotNull(message = "Cabin Flooring prize cannot be null")
    @Min(value = 1, message = "Cabin Flooring prize must be greater than 0")
    private int price;
}