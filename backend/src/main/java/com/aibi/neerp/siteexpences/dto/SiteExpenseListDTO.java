package com.aibi.neerp.siteexpences.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.aibi.neerp.siteexpences.enums.ExpenseType;
import com.aibi.neerp.siteexpences.enums.PaymentMethod;

import lombok.Builder;
import lombok.Data;

//SiteExpenseListDTO.java
@Data
@Builder
public class SiteExpenseListDTO {
 private Integer expenseId;
 private BigDecimal amount;
 private LocalDate expenseDate;
 private ExpenseType expenseType;
 private PaymentMethod paymentMethod;
 private String narration;
 private String employeeName; 
 private String siteName; // For the linked Site Name
 private String jobType; 
 private String expenseHandoverToName;
}
