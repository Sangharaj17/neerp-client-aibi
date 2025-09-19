package com.aibi.neerp.amc.jobs.initial.dto;

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
    private String startDate;
    private String endDate;
    private Integer noOfServices;
    private String jobAmount;
    private String amountWithGst;
    private String amountWithoutGst;
    private String paymentTerm;
    private Integer gstPercentage;
    private String dealDate;
    private String jobLiftDetail;
    private String jobStatus;
    private Boolean status;
    private String renewalRemark;
    private Boolean isNew;
    private Integer currentServiceNumber;
}

