package com.aibi.neerp.leadmanagement.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeadTodoActivityResponseDto {
    private Integer activityId;
    private Integer leadId;
    private Integer todoId;
    private String activityByEmpName;
    private String activityTitle;
    private String feedback;
    private LocalDate activityDate;
    private String activityTime;
}
