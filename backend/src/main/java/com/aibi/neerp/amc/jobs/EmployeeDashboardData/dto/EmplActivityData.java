package com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmplActivityData {

	private String empname;
	
	private Integer serviceActivityCount;
	
	private Integer breakDownActivityCount;
	
}
