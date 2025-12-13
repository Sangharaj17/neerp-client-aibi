package com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmpActivitiesCountsData {
	
	private String empName;
	private Integer empId;
	
	private Integer assignedDoneServiceCounts;
	private Integer assignedDoneBreakdownCounts;
	
	private Integer unassignedDoneServiceCounts;
	private Integer unassignedDoneBreakdownCounts;
	
	private Integer totalServiceDoneCounts;
	private Integer totalBreakDownDoneCounts;
	
	private Integer totalAssignedAmcJobs;

}
