package com.aibi.neerp.leadmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeadStatusDto {

    private Integer id;

    @NotBlank(message = "Status name must not be blank")
    private String statusName;

    private String description;
}
