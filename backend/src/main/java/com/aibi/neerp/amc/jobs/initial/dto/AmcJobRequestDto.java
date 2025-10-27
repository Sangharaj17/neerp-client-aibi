package com.aibi.neerp.amc.jobs.initial.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcJobRequestDto {

    private Integer leadId;
    private Integer amcQuatationId;
    private Integer revisedQuatationId;
    private Integer serviceEngineerId;
    private Integer salesExecutiveId;
    private Integer routeId;
    
    private List<Integer> listOfEmployees;

    private Integer renewlStatus;
    private String contractType;
    private String makeOfElevator;
    private Integer noOfElevator;
    private String jobNo;
    private String customerGstNo;
    private String jobType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer noOfServices;
    private BigDecimal jobAmount;
    private String amountWithGst;
    private String amountWithoutGst;
    private String paymentTerm;
    private Integer gstPercentage;
    private LocalDate dealDate;
    private String jobLiftDetail;
    private String jobStatus;
    private Boolean status;
    private String renewalRemark;
    private Boolean isNew;
    private Integer currentServiceNumber;
}

