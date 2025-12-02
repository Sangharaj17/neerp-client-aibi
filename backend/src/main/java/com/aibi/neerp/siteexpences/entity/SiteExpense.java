package com.aibi.neerp.siteexpences.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.siteexpences.enums.ExpenseType;
import com.aibi.neerp.siteexpences.enums.PaymentMethod;

@Entity
@Table(name = "tbl_site_expense")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "expense_id")
    private Integer expenseId;

    // 🔗 Link to AMC Job
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amc_job_id")
    private AmcJob amcJob;

    // 🔗 Link to AMC Renewal Job
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amc_renewal_job_id")
    private AmcRenewalJob amcRenewalJob;
    
    @Column
    private String jobType;

    // 👨‍🔧 Employee who spent/claimed the expense
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "expense_type", nullable = false, length = 50)
    private ExpenseType expenseType;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Column(name = "narration", columnDefinition = "TEXT")
    private String narration;

    // 👤 Expense handover to employee
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "handover_to_employee_id")
    private Employee expenseHandoverTo;
}
