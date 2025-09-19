package com.aibi.neerp.amc.jobs.initial.dto;


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
    private String todoDate;
    private String time;
    private String venue;
    private String complaintName;
    private String complaintMob;
}
