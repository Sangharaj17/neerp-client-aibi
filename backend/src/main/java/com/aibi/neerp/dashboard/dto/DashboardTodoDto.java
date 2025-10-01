package com.aibi.neerp.dashboard.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardTodoDto {
	private Integer leadId;
	private Integer todoId;
    private String todoName;
    private String dateAndTime;
}
