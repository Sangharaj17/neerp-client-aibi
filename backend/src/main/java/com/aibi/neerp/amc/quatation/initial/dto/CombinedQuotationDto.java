package com.aibi.neerp.amc.quatation.initial.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CombinedQuotationDto {
    private Integer enquiryId;
    private Integer revisedQuotationId;
    private Integer renewalQuotationId;
    private Integer revisedRenewalId;

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

    private String liftType;
    private String machineType;
    private String noOfFloors;
    private String capacityTerm;
    private String selectPerson;
    private Integer from;
}
