package com.aibi.neerp.quotation.jobs.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoicePaymentSummaryDTO {

    private Integer invoiceId;
    private String invoiceNo;

    private BigDecimal invoiceAmount;
    private BigDecimal totalPaid;
    private BigDecimal balanceAmount;

    private Boolean isCleared;
}
