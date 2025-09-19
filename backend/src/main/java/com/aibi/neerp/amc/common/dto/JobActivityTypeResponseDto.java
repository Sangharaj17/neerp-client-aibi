package com.aibi.neerp.amc.common.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobActivityTypeResponseDto {
    private Long id;
    private String activityName;
    private String description;
    private Boolean isActive;
}

