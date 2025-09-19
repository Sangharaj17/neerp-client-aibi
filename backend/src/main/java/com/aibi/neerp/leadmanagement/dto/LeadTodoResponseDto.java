package com.aibi.neerp.leadmanagement.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeadTodoResponseDto {
    private Integer todoId;
    private Integer leadId;
    private String leadCompanyName;
    private String customerName;
    private String activityByEmpName;
    private String purpose;
    private LocalDate todoDate;
    private String time;
    private String venue;
}
