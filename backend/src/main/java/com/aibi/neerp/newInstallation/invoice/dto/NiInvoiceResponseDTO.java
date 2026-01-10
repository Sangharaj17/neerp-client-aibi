package com.aibi.neerp.newInstallation.invoice.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class NiInvoiceResponseDTO {

    private Integer invoiceId;
    private String invoiceNo;
    private LocalDate invoiceDate;

    private Integer jobId;

    private BigDecimal baseAmount;
    private BigDecimal cgstAmount;
    private BigDecimal sgstAmount;
    private BigDecimal totalAmount;

    private String sacCode;
    private String payFor;

    private String status;
    private String siteName;
    private String siteAddress;
    private String customerName;

    private Boolean isCleared;

}
