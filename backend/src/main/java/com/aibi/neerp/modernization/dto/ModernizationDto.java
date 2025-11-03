package com.aibi.neerp.modernization.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModernizationDto {

    private Integer id;
    private String quotationNo;
    private LocalDate quotationDate;
    private Integer leadId;
    private Integer enquiryId;
    private Integer combinedEnquiryId;
    private Long workPeriodId;
    private String jobId;
    private String note;
    private Integer gst;
    private Integer warranty;
    private BigDecimal amount;
    private BigDecimal amountWithGst;
    private Boolean isFinal;
    private LocalDate quotationFinalDate;
    private String gstApplicable;
    private BigDecimal gstPercentage;
    private BigDecimal subtotal;
    private BigDecimal gstAmount;
    
    private String customerName;
    private String siteName;
}
