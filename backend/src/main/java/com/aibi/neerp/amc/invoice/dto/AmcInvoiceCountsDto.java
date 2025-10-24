package com.aibi.neerp.amc.invoice.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AmcInvoiceCountsDto {
    private long totalInvoices;
    private long paidInvoices;
    private long pendingInvoices;
    private double totalAmountReceived;
}
