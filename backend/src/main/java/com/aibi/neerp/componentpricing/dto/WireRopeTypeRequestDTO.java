package com.aibi.neerp.componentpricing.dto;

import lombok.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WireRopeTypeRequestDTO {

    @NotBlank(message = "Wire Rope Type cannot be blank")
    @Size(max = 255, message = "Wire Rope Type must not exceed 255 characters")
    private String wireRopeType;
}
