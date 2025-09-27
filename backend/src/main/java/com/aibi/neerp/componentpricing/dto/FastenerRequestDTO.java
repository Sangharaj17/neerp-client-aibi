package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FastenerRequestDTO {

    @NotBlank(message = "Fastener name is required")
    private String fastenerName;

    @NotNull(message = "Floor ID is required")
    private Integer floorId;

    @NotNull(message = "Price is required")
    private Integer price;
}