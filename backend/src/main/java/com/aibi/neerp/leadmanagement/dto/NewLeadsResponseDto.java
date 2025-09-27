package com.aibi.neerp.leadmanagement.dto;


import lombok.*;

import java.time.LocalDateTime;

import com.aibi.neerp.employeemanagement.dto.EmployeeDto;
import com.aibi.neerp.leadmanagement.entity.ProjectStage;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NewLeadsResponseDto {
    private Integer leadId;
    private LocalDateTime leadDate;
    private EmployeeDto activityBy;
    private LeadSourceDto leadSource;
    private String leadType;
    private Integer leadTypeId;
    private String leadCompanyName;
    private String salutations;
    private String salutations2;
    private String customerName;
    private String customerName2;
    private DesignationDto designation;
    private DesignationDto designation2;
    private String emailId;
    private String emailId2;
    private String countryCode;
    private String contactNo;
    private String customer1Contact;
    private String customer2Contact;
    private String LandlineNo;
    private String address;
    private String siteName;
    private String siteAddress;
    private LeadStageDto leadStage;
    private String status;
    private String reason;
    private Integer isSendQuotation;
    private Integer quatationId;
    private Integer amcQuatationId;
    private Integer modQuotId;
    private Integer oncallQuotId;
    private LocalDateTime expiryDate;
    private String makeOfElevator;
    private Integer noOfElevator;
    private Integer gstPercentage;
    private Double amountOrdinary;
    private Double gstOrdinary;
    private Double totalAmountOrdinary;
    private Double amountComp;
    private Double gstComp;
    private Double totalAmountComp;
    private ContractDto contract;
    private AreaDto area;
    private ProjectStage projectStage;
}
