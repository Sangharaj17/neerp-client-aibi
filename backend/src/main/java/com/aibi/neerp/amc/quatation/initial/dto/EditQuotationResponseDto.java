package com.aibi.neerp.amc.quatation.initial.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EditQuotationResponseDto {

    private Integer amcQuatationId;
    private Integer revisedQuatationId;
    private LocalDate quatationDate;
    private Integer leadId;
    private Integer combinedEnquiryId;
    private Integer enquiryId;
    private Long makeOfElevatorId;
    private Long paymentTermId;
    private Integer createdById;

    private Integer noOfElevator;
    private String typeOfElevator;
    private LocalDate fromDate;
    private LocalDate toDate;

    private BigDecimal isFinalOrdinary;
    private BigDecimal isFinalSemiComp;
    private BigDecimal isFinalComp;

    private BigDecimal amountOrdinary;
    private BigDecimal gstOrdinary;

    private BigDecimal amountSemiComp;
    private BigDecimal gstSemi;

    private BigDecimal amountComp;
    private BigDecimal gstComp;

    private String status;
    private String typeContract;
    private Long noOfServicesId;
    private BigDecimal gstPercentage;
    private Integer isFinal;
    private Integer jobStatus;
    private LocalDate forecastMonth;

    private String customerName;
    private String selectLead;
    private String customerSite;

    private List<CombinedQuotationDto> combinedQuotations;
}
