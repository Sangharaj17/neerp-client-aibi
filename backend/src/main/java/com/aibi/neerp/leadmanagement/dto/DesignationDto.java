package com.aibi.neerp.leadmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DesignationDto {
    private Integer designationId;

    @NotBlank(message = "Designation name must not be blank")
    private String designationName;
}
