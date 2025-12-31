package com.aibi.neerp.newInstallation.invoice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NiInvoiceSummaryDTO {
    private long totalInvoices;
    private long paidInvoices;
    private long pendingInvoices;
    private BigDecimal totalAmountReceived;
}
