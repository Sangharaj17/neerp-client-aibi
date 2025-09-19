package com.aibi.neerp.leadmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuildTypeDto {
    private Integer id;

    @NotBlank(message = "Build type name must not be blank")
    private String name;
}
