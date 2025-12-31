package com.aibi.neerp.quotation.jobs.dto;

import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationJobResponseDTO {

    private Integer jobId;

    private Integer leadId;
    private Integer combinedEnquiryId;
    private Integer customerId;
    private String customerName;
    private Integer siteId;
    private String siteName;
    private String siteAddress;
    private Integer niQuotationId;
    private String quotationNo;
    private Integer serviceEngineerId;
    private String serviceEngineerName;
    private Integer salesExecutiveId;
    private String salesExecutiveName;

    private String jobNo;
    private Integer jobTypeId;
    private String jobNoFormatted;
    private String jobTypeName;
    private BigDecimal jobAmount;
    private BigDecimal paidAmount;
    private String jobStatus;
    private String jobLiftDetail;
    private String paymentTerm;
    private String customerGstNo;

    private LocalDate startDate;
    private LocalDateTime orderDate;
    private LocalDate dealDate;
    private Boolean isHandover;
    private LocalDate handoverDate;
    private String pwdStatus;
    private LocalDate pwdActDate;
    private Integer createdById;
    private String createdByName;
    private LocalDate createdAt;

    private Boolean pwdIncluded;
    private Double pwdAmount;
    private Integer noOfLifts;

    private Long attachedDocumentCount;

    private Integer totalActivities;

    private List<JobActivityResponseDTO> recentActivities; // Last 5 activities
}
