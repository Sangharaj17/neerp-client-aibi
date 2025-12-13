package com.aibi.neerp.quotation.jobs.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class QuotationJobRequestDTO {

    private Integer leadId;
    private Integer combinedEnquiryId;
    private Integer customerId;
    private Integer siteId;
    private Integer niQuotationId;
    private Integer serviceEngineerId;
    private Integer salesExecutiveId;
    private Integer createdById;

    private String jobNo;
    private Integer jobTypeId;
    private BigDecimal jobAmount;
    private String jobStatus;
    private String jobLiftDetail;
    private String paymentTerm;
    private String customerGstNo;

    private LocalDate startDate;
    private LocalDate dealDate;
    private Boolean isHandover;
    private LocalDate handoverDate;
    private String pwdStatus;
    private LocalDate pwdActDate;
}
