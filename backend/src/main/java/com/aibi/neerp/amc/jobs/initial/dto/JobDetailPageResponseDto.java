package com.aibi.neerp.amc.jobs.initial.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobDetailPageResponseDto {
    private JobDetailResponseDto jobDetails;
    private List<JobActivityResponseDto> jobActivities;
    private List<LiftData> liftDatas;
    private List<EmployeeDto> employeeDtos;
}

