package com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto;

import java.time.LocalDate;
import java.util.List;

import com.aibi.neerp.amc.jobs.initial.dto.EmployeeDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ActivityDetailsData {
	
	private LocalDate activityDate;
	private String customerName;
	private String siteName;
	private String siteaddress;
	private List<EmployeeDto> assignedTechnicians;
	private String activityBy;
	private String description;

}
