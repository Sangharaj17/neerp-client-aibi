package com.aibi.neerp.amc.quatation.initial.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcQuotationViewResponseDto {

    // --- Main Quotation Details ---
	private Integer revisedAmcQuatationId;
    private Integer amcQuatationId;
    private String quatationDate;
    private String typeContract;
    private String makeOfElevator;
    private String paymentTerm;
    private Integer noOfServices;
    private String fromDate;
    private String toDate;

    // --- Non-Comprehensive/Semi/Comp amounts ---
    private BigDecimal amountOrdinary;
    private BigDecimal gstOrdinary;
    private BigDecimal finalOrdinary;

    private BigDecimal amountSemiComp;
    private BigDecimal gstSemi;
    private BigDecimal finalSemiComp;

    private BigDecimal amountComp;
    private BigDecimal gstComp;
    private BigDecimal finalComp;

    // --- Combined Quotations Table ---
    private List<CombinedQuotationDto> combinedQuotations;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CombinedQuotationDto {
        private Integer noOfElevators;
        private String typeOfElevators;
        private BigDecimal amountOrdinary;
        private BigDecimal gstOrdinary;
        private BigDecimal totalAmountOrdinary;
        private BigDecimal amountSemi;
        private BigDecimal gstSemi;
        private BigDecimal totalAmountSemi;
        private BigDecimal amountComp;
        private BigDecimal gstComp;
        private BigDecimal totalAmountComp;
        private String capacity;
    }
}
