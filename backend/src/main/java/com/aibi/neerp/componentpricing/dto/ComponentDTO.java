package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ComponentDTO {

    private Integer id; // optional in request, filled in response

    @NotBlank(message = "Name is required")
    private String name;
}

