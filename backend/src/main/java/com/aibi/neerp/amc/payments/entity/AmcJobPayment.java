package com.aibi.neerp.amc.payments.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.aibi.neerp.amc.invoice.entity.AmcInvoice;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;

@Entity
@Table(name = "tbl_amc_job_payment") 
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcJobPayment { 

    // Primary Key (payment_id) - AUTO_INCREMENT
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId; 

    // Column: payment_date (Uses LocalDate)
    @Column(name = "payment_date")
    private LocalDate paymentDate; 

    // Column: invoice_no
    @Column(name = "invoice_no", length = 255)
    private String invoiceNo; 

    // Column: pay_for
    @Column(name = "pay_for", length = 255)
    private String payFor; 

    // Column: payment_type
    @Column(name = "payment_type", length = 255)
    private String paymentType; 

    // Column: cheque_no
    @Column(name = "cheque_no", length = 255)
    private String chequeNo; 

    // Column: bank_name
    @Column(name = "bank_name", length = 255)
    private String bankName; 

    // Column: branch_name
    @Column(name = "branch_name", length = 255)
    private String branchName; 

    // Column: amount_paid (Uses BigDecimal)
    @Column(name = "amount_paid", length = 255) 
    private BigDecimal amountPaid; 

    // Column: payment_cleared
    @Column(name = "payment_cleared", length = 255)
    private String paymentCleared; 
    
    // --- Foreign Key Relationships ---

    // 1. Foreign Key Relationship to AmcJob
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", referencedColumnName = "job_id") 
    private AmcJob amcJob; 

    // 2. Foreign Key Relationship to AmcRenewalJob
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renewl_job_id", referencedColumnName = "job_renewl_id")
    private AmcRenewalJob amcRenewalJob; 
    
    // 3. Foreign Key Relationship to AmcInvoice
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", referencedColumnName = "invoice_id")
    private AmcInvoice amcInvoice; 
}
