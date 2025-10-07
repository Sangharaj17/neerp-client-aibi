package com.aibi.neerp.amc.quatation.renewal.dto;

import com.aibi.neerp.amc.quatation.initial.dto.AmcCombinedQuotationRequestDto;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcRenewalQuotationRequestDto {

	private  Integer amcquatationId;
    private LocalDate quatationDate;
    
    private Integer amcRenewQuatationId;
    private Integer revisedRenewQuatationId;

    // ---------- Foreign Keys ----------
    private Integer preJobId;
    private Integer leadId;
    private Integer combinedEnquiryId;  // fully from frontend
    private Integer enquiryId;
    private Long makeOfElevatorId;
    private Long paymentTermId;
    private Integer createdById;

    // ---------- Other Fields ----------
    private Integer noOfElevator;
    private String typeOfElevator;
    private LocalDate  fromDate;
    private LocalDate toDate;

    private BigDecimal amountOrdinary;
    private BigDecimal gstOrdinary;

    private BigDecimal amountSemiComp;
    private BigDecimal gstSemi;

    private BigDecimal amountComp;
    private BigDecimal gstComp;
    
    private BigDecimal isFinalOrdinary;
    private BigDecimal isFinalSemicomp;
    private BigDecimal isFinalComp;

    private String status;
    private String typeContract;
    private Integer noOfServicesId;
    private BigDecimal gstPercentage;
    private Integer isFinal;
    private Integer jobStatus;
    private LocalDate  forecastMonth;

    // ---------- Nested Combined Quotations ----------
    private List<AmcCombinedQuotationRequestDto> combinedQuotations = new ArrayList<>();
}
