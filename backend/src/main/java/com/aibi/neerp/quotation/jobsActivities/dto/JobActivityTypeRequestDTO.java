package com.aibi.neerp.quotation.jobsActivities.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobActivityTypeRequestDTO {

    @NotBlank(message = "Activity type name is required")
    private String typeName;

    @NotNull(message = "Status is required")
    private Boolean status;
}

