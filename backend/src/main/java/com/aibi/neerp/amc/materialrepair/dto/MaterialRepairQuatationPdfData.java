package com.aibi.neerp.amc.materialrepair.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MaterialRepairQuatationPdfData {

    private String companyName;
    private String officeAddress;
    private String GSTIN_UIN;
    private String contactNo;
    private String email;
    private String invoiceNo;
    private LocalDate dated;
    private String purchaseOrderNo;
    private LocalDate purchaseOrderNoDated;
    private String deliveryChallanNo;
    private LocalDate deliveryChallanNoDated;

    private String buyerAddress;
    private String gstin;
    private String buyerContactNo;

    // Site Name / Ship To
    private String siteName;
    private String siteAddress;

    private List<MaterialDetails> materialDetails;

    private BigDecimal subTotal;
    private String cgstStr;
    private String sgstStr;
    private BigDecimal cgstAmount;
    private BigDecimal sgstAmount;
    private BigDecimal roundOffValue;
    private BigDecimal grandTotal;

    private String amountChargeableInWords;

    // Bank Details
    private String name;
    private String accountNumber;
    private String branch;
    private String ifscCode;
    private String forCompany;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MaterialDetails {
        private String particulars;
        private String hsnSac;
        private Integer quantity;
        private BigDecimal rate;
        private String per;
        private BigDecimal amount;
    }
}
