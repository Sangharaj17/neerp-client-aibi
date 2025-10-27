package com.aibi.neerp.amc.payments.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcJobPaymentResponseDto {

    private Integer paymentId;
    private LocalDate paymentDate;
    private String invoiceNo;
    private String payFor;
    private String paymentType;
    private String chequeNo;
    private String bankName;
    private String branchName;
    private BigDecimal amountPaid;
    private String paymentCleared;

    // Simplified foreign key references
    private Integer jobId;
    private Integer renewalJobId;
    private Integer invoiceId;
}

