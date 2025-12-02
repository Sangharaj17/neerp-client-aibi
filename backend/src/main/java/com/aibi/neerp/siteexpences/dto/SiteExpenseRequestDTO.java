package com.aibi.neerp.siteexpences.dto;

import com.aibi.neerp.siteexpences.enums.ExpenseType;
import com.aibi.neerp.siteexpences.enums.PaymentMethod;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SiteExpenseRequestDTO {

    // IDs for linked entities (No constraints)
    private Integer amcJobId; 
    private Integer amcRenewalJobId; 
    private Integer employeeId; // Who spent/claimed (originally mandatory)
    private Integer expenseHandoverToEmployeeId; 

    // Expense details (No constraints)
    private ExpenseType expenseType;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private PaymentMethod paymentMethod;
    private String narration;
}
