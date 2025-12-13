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
public class TopEmplByActivityData {

	private List<EmplActivityData> emplActivityDatas;
	
}
