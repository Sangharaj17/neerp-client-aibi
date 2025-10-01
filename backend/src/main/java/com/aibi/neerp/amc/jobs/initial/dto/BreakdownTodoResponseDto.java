package com.aibi.neerp.amc.jobs.initial.dto;


import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BreakdownTodoResponseDto {

    private Integer custTodoId;
    private String purpose;
    private LocalDate todoDate;
    private LocalTime time;
    private String venue;
    private String complaintName;
    private String complaintMob;
    
    private String description;
}
