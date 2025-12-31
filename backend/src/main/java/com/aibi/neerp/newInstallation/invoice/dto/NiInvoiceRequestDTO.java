package com.aibi.neerp.newInstallation.invoice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class NiInvoiceRequestDTO {

    @NotNull(message = "Job ID is required")
    private Integer jobId;

    @NotNull(message = "Lead ID is required")
    private Integer leadId;

    @NotNull(message = "Combined Enquiry ID is required")
    private Integer combinedEnquiryId;

    @NotNull(message = "Quotation ID is required")
    private Integer quotationId;

    @NotNull(message = "Invoice date is required")
    private LocalDate invoiceDate;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotNull(message = "Created by is required")
    private Integer createdBy;

    private String quotationNo;
    private String payFor;
}


