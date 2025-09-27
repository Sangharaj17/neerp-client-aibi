package com.aibi.neerp.amc.jobs.initial.dto;


import java.time.LocalDate;

import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobDetailResponseDto {
    private String jobNo;
    private String customerName;
    private String siteName;
    private LocalDate orderDate;
    private Integer numberOfLift;
    private String jobLiftDetail;
    private String salesExecutive;
    private String serviceEngineer;
    private String jobStatus;
    private String totalService;
    private String jobType;
    private String siteAddress;
    private LocalDate startDate;
    private LocalDate endDate;
    private String jobAmount;
    private String receivedAmount;
    private String balanceAmount;
    private String pendingService;
}

