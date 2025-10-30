package com.aibi.neerp.amc.materialrepair.dto;


import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
public class MaterialQuotationResponseDto {

    private Integer modQuotId;
    private String quatationNo;
    private LocalDate quatationDate;

    private String jobNo;          // from AmcJob
    private String renewalJobNo;   // from AmcRenewalJob (nullable)

    private String note;
    private Integer gst;
    private String workPeriod;
    private Integer isFinal;
    private LocalDate quotFinalDate;
    
    private String siteName;
    private String customerName;

    private List<QuotationDetailResponseDto> details;
}
