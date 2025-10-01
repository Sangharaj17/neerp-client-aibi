package com.aibi.neerp.amc.jobs.initial.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ServiceEmployeeReport {
	
	private String empName;
	private Integer assginedServiceCounts;
	private Integer doneServiceCounts;
	private Integer pendingServicesCounts;

}
