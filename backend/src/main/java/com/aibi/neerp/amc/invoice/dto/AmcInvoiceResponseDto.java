package com.aibi.neerp.amc.invoice.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AmcInvoiceResponseDto {
    
    // Primary Key (Generated ID)
    private Integer invoiceId; 
    
    private String siteName;
    private String siteAddress;
    
    private String paymentStatus;
    
    // Foreign Keys (IDs)
    private Integer jobNo;
    private Integer renewlJobId;

    // Invoice Details
    private String invoiceNo;
    private LocalDate invoiceDate;
    private String descOfService;
    private String sacCode;
    
    // Amounts
    private BigDecimal baseAmt;
    private BigDecimal cgstAmt;
    private BigDecimal sgstAmt;
    private BigDecimal totalAmt;

    private String payFor;
    private Integer isCleared; // Using Integer as requested
}