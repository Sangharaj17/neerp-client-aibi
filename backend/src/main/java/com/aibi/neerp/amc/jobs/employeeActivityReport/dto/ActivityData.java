package com.aibi.neerp.amc.jobs.employeeActivityReport.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor; // <-- ADD THIS IMPORT
import lombok.Data;
import lombok.NoArgsConstructor; // <-- ADD THIS IMPORT

@Data
@NoArgsConstructor // Added for flexibility (e.g., Spring/Jackson)
@AllArgsConstructor // <-- KEY ADDITION: Allows easy construction in the Service Layer
public class ActivityData {
	
	private LocalDate activityDate;
	private String customerName;
	private String siteName;
	private String activityType;
	private String activityBy;

}