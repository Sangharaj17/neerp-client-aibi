package com.aibi.neerp.leadmanagement.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NewLeadsRequestDto {
    private LocalDateTime leadDate;
    private Integer activityById;
    private Integer leadSourceId;
    private String leadType;
    private String leadCompanyName;
    private String salutations;
    private String salutations2;
    private String customerName;
    private String customerName2;
    private Integer designationId;
    private Integer designation2Id;
    private String emailId;
    private String emailId2;
    private String countryCode;
    private String contactNo;
    private String customer1Contact;
    private String customer2Contact;
    private String landlineNo;
    private String address;
    private String siteName;
    private String siteAddress;
    private Integer leadStageId;
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
    private Integer contractId;
    private Integer areaId;
}
