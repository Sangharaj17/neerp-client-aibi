package com.aibi.neerp.quotation.jobs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobForPaymentResponseDTO {

    private Integer jobId;
    private String jobNo;
    private String jobTypeName;

    private String customerName;
    private String siteName;

    private BigDecimal jobAmount;
    private BigDecimal paidAmount;

    // ✅ Company details (from CompanySetting)
    private String companyName;
    private String companyMail;
}

