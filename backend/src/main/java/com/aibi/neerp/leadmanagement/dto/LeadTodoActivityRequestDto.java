package com.aibi.neerp.leadmanagement.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeadTodoActivityRequestDto {
    private Integer leadId;
    private Integer todoId;
    private Integer activityByEmpId;
   // private String activityTitle;
    private String feedback;
    private LocalDate activityDate;
    private String activityTime;
}
