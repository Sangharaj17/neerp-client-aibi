package com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MonthlyActivityCount {
	
	private String month;
	private Integer monthInNum;
	
	private Integer totalServicesCounts ;
	private Integer totalBreakDownsCounts;

}
