package com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class YearlyActivityData {
	
	private String currentYear;
	private Integer totalActiveJobs;	
	private Integer toatlServiceDoneCurrentMonth;	
	private String currentMonthAndYear;
	
	private List<MonthlyActivityCount> monthlyActivityCounts ;
	

}
