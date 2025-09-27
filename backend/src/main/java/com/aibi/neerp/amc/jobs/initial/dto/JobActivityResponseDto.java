package com.aibi.neerp.amc.jobs.initial.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobActivityResponseDto {
    private Integer id;
    private String date;
    private String activityBy;
    private String activityType;
    private String serviceType;
    private String description;
    private String remark;
    private String reportUrl; // Optional, can be null if no PDF
    private String liftName;
}

