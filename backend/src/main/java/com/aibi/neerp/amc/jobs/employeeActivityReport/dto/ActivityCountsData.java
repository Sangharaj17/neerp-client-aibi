package com.aibi.neerp.amc.jobs.employeeActivityReport.dto;

import lombok.AllArgsConstructor; // <-- ADD THIS IMPORT
import lombok.Data;
import lombok.NoArgsConstructor; // <-- BEST PRACTICE: Add this too for JPA/Jackson

@Data
@NoArgsConstructor // Added for flexibility (e.g., Jackson serialization)
@AllArgsConstructor // <-- THIS IS THE KEY ADDITION
public class ActivityCountsData {
    // Job Activity Counts
    private long totalNonRenewalJobActivityCount; // Changed to long to match service
    private long totalRenewalJobActivityCount;    // Changed to long to match service
    
    // Service Activity Counts
    private long totalNonRenewalServiceActivityCount; // Changed to long to match service
    private long totalRenewalServiceActivityCount;    // Changed to long to match service
    
    // Breakdown Activity Counts
    private long totalNonRenewalBreakdownActivityRenewalCount; // Changed to long to match service
    private long totalRenewalBreakdownActivityCount;           // Changed to long to match service
}