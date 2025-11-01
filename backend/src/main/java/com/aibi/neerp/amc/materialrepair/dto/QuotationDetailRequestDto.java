package com.aibi.neerp.amc.materialrepair.dto;


import java.math.BigDecimal;
import lombok.Data;

@Data
public class QuotationDetailRequestDto {

    private String materialName;
    private String hsn;
    private Integer quantity;
    private BigDecimal rate;
    private BigDecimal amount;
    private String guarantee;
}

