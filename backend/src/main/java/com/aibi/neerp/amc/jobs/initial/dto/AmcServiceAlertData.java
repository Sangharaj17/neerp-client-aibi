package com.aibi.neerp.amc.jobs.initial.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class AmcServiceAlertData {
	
	private Integer amcJobid;
	private String site;
	private String place;
	private String customer;
	
	private List<EmployeeDto> assignedServiceEmployess;
	
	private LocalDate previousServicingDate;
	private String month;
	private String service;
	private String remark;
	
	private Integer currentServiceCompletedLiftCounts;
	private Integer currentServicePendingLiftCounts;
	
	private Integer currentServiceTotalLiftsCounts;

}
