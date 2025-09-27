package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounterWeightTypeRequestDTO {
    @NotBlank(message = "Name cannot be blank")
    private String name;
}
