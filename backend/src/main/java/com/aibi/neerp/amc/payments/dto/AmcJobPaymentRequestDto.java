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
public class AmcJobPaymentRequestDto {

    private LocalDate paymentDate;      // e.g., 2025-10-27
    private String invoiceNo;           // e.g., "INV-00123"
    private String payFor;              // e.g., "AMC Renewal"
    private String paymentType;         // e.g., "Cash", "Cheque", "Online"
    private String chequeNo;            // applicable if paymentType = "Cheque"
    private String bankName;            // applicable if paymentType = "Cheque"
    private String branchName;          // applicable if paymentType = "Cheque"
    private BigDecimal amountPaid;      // e.g., 15000.00
    private String paymentCleared;      // e.g., "Yes" / "No"

    // Foreign key references (IDs only)
    private Integer jobId;              // from tbl_amc_job
    private Integer renewalJobId;       // from tbl_amc_job_renewal
    private Integer invoiceId;          // from tbl_amc_invoice
}

