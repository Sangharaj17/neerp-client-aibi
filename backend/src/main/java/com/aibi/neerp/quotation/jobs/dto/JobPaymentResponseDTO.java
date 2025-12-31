package com.aibi.neerp.quotation.jobs.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPaymentResponseDTO {

    private Integer paymentId;

    private Integer jobId;
    private String jobNo;
    private String jobType;
    private LocalDate startDate;

    private Integer invoiceId;
    private String invoiceNo;

    private LocalDate paymentDate;

    private BigDecimal amountPaid;

    private String paymentType;
    private String chequeNo;
    private String bankName;
    private String branchName;

    private Boolean paymentCleared;

    private String customerName;
    private String siteName;

    private String payFor;

    private LocalDateTime createdAt;
}

