package com.aibi.neerp.amc.invoice.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.aibi.neerp.amc.materialrepair.entity.MaterialQuotation;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import com.aibi.neerp.modernization.entity.Modernization;
import com.aibi.neerp.oncall.entity.OnCallQuotation;

import jakarta.persistence.ManyToOne;

@Data
public class AmcInvoiceRequestDto {
    
    // Foreign Keys (IDs provided by client)
    private Integer jobNo; 
    private Integer renewlJobId;
    
    private MaterialQuotation materialQuotation = null;
    private OnCallQuotation onCallQuotation = null;
    private Modernization modernization = null;

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
    
    private EnquiryType enquiryType;

    private String payFor;
    private Integer isCleared; // Using Integer as requested
}