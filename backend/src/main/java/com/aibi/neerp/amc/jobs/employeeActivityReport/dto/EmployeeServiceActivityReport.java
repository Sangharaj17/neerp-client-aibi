package com.aibi.neerp.amc.jobs.employeeActivityReport.dto;

import java.util.List;

import lombok.Data;

@Data
public class EmployeeServiceActivityReport {
	
	private List<ActivityData> nonRenewalActivityDatas;
	private List<ActivityData> renewalActivityDatas;
	
	private ActivityCountsData activityCountsData;

}
