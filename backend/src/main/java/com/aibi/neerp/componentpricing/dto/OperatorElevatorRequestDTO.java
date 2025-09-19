package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OperatorElevatorRequestDTO {

    @NotBlank(message = "Operator name is mandatory")
    @Size(max = 255, message = "Name must be at most 255 characters")
    private String name;
}
