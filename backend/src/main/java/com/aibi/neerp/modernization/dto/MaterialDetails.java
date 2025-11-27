package com.aibi.neerp.modernization.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public  class MaterialDetails {
    private String particulars;
    private String hsnSac;
    private Integer quantity;
    private BigDecimal rate;
    private String per;
    private BigDecimal amount;
}