package com.aibi.neerp.dashboard.dto;

import lombok.Data;

@Data
public class DashboardCountsData {
	
	private Integer totalActiveLeadCounts;
	private Integer totalNewInstallationQuatationCounts;
	private Integer totalAmcQuatationCounts;
	private Integer totalCustomerCounts;
	private Integer totalAmcForRenewalsCounts;
	private Integer closedLeadsCounts;

}
