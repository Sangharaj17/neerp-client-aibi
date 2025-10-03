package com.aibi.neerp.dashboard.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAmcRenewalsListData {

    private Integer amcJobId;
    private String customerName;
    private String customerSiteName;
    private String amcPeriod;      // e.g., "Jan 2025 - Dec 2025"
    private BigDecimal amount;     // AMC amount
    private Integer remainingDays; // Days left before renewal
    private String status;         // e.g., "Active", "Expired"

}
