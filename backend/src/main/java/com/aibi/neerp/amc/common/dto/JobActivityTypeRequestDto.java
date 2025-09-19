package com.aibi.neerp.amc.common.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobActivityTypeRequestDto {
    private String activityName;
    private String description;
    private Boolean isActive;
}

