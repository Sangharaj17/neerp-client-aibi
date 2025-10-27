package com.aibi.neerp.amc.jobs.renewal.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcRenewalJobResponseDto {

    private Integer renewalJobId;
    private String jobType;
    private String jobNo;
    private String customerName;
    private String siteName;
    private String siteAddress;
    private String place;
    private List<String> serviceEngineers; // we send only names
    private String model;
    private BigDecimal jobAmount;
    private String paymentTerm;
    private LocalDate startDate;
    private LocalDate endDate;
    private String jobStatus;
}

