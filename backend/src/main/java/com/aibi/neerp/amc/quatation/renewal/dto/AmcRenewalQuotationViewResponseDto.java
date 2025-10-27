package com.aibi.neerp.amc.quatation.renewal.dto;


import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcRenewalQuotationViewResponseDto {

    // --- Main Quotation Details ---
	private Integer revisedAmcRenewalQuatationId;
    private Integer amcRenewalQuatationId;
    private LocalDate quatationDate;
    private String typeContract;
    private String makeOfElevator;
    private String paymentTerm;
    private Integer noOfServices;
    private LocalDate fromDate;
    private LocalDate toDate;

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

