package com.aibi.neerp.amc.payments.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTypeCount {
    private String paymentType;
    private long count;
    private BigDecimal totalAmount;
}

