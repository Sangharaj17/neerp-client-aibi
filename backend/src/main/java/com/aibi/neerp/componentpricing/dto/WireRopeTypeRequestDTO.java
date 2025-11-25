package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WireRopeTypeRequestDTO {

    @NotNull(message = "Machine Type ID cannot be null")
    @Positive(message = "Machine Type ID must be positive")
    private Integer machineTypeId;

    @NotNull(message = "Wire Rope Size cannot be null")
    @Positive(message = "Wire Rope Size must be positive")
    private Double wireRopeSize;

    @NotBlank(message = "Wire Rope Type cannot be blank")
    @Size(max = 255, message = "Wire Rope Type must not exceed 255 characters")
    private String wireRopeType;
}
