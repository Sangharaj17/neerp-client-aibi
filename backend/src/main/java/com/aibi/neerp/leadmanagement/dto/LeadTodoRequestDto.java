package com.aibi.neerp.leadmanagement.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeadTodoRequestDto {
    private Integer leadId;
    private Integer activityByEmpId;
    private String purpose;
    private LocalDate todoDate;
    private String time;
    private String venue;
}
