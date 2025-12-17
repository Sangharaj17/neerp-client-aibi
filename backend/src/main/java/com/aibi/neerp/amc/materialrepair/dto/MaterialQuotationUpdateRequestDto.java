package com.aibi.neerp.amc.materialrepair.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
public class MaterialQuotationUpdateRequestDto {
    private Long modQuotId; // Required for identifying the record
    private LocalDate quatationDate;
    private String note;
    private Integer gst;
    private Long workPeriodId; 
    private Integer isFinal;
    private LocalDate quotFinalDate;
    
    private Double subTotal;
    private Double gstAmt;
    private Double grandTotal;

    private List<QuotationDetailRequestDto> details;
}