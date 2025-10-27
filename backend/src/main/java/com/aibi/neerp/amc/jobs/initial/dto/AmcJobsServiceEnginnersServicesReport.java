package com.aibi.neerp.amc.jobs.initial.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AmcJobsServiceEnginnersServicesReport {
	
	private Integer totalAmcJobs;
	private Integer amcDoneCounts;
	private Integer amcPendingCounts;
	
	private List<ServiceEmployeeReport> serviceEmployeeReports ;

}
