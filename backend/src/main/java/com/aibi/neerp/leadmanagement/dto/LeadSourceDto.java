package com.aibi.neerp.leadmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeadSourceDto {
    private Integer leadSourceId;

    @NotBlank(message = "Source name must not be blank")
    private String sourceName;
}
