package com.aibi.neerp.quotation.jobsActivities.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobActivityTypeResponseDTO {

    private Long id;
    private String typeName;
    private Boolean status;
}
