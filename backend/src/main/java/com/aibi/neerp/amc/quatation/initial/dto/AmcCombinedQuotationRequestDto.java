package com.aibi.neerp.amc.quatation.initial.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcCombinedQuotationRequestDto {

    private Integer enquiryId;                 // FK to Enquiry
    private Integer revisedQuotationId;        // FK to RevisedAmcQuotation
    private Integer renewalQuotationId;        // FK to AmcRenewalQuotation
    private Integer revisedRenewalId;          // FK to RevisedRenewalAmcQuotation

    private BigDecimal amount;
    private BigDecimal gstAmount;
    private BigDecimal totalAmount;

    private BigDecimal amountOrdinary;
    private BigDecimal amountSemi;
    private BigDecimal amountComp;

    private BigDecimal gstOrdinary;
    private BigDecimal gstSemi;
    private BigDecimal gstComp;

    private BigDecimal totalAmountOrdinary;
    private BigDecimal totalAmountSemi;
    private BigDecimal totalAmountComp;
}
