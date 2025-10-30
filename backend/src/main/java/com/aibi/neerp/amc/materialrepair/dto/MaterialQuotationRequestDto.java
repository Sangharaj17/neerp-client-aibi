package com.aibi.neerp.amc.materialrepair.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
public class MaterialQuotationRequestDto {

    private String quatationNo;
    private LocalDate quatationDate;
    
    private Integer jobId;          // from AmcJob
    private Integer jobRenewlId;    // from AmcRenewalJob

    private String note;
    private Integer gst;
    private Long workPeriodId;
    private Boolean isFinal;
    private LocalDate quotFinalDate;

    private List<QuotationDetailRequestDto> details;
}
