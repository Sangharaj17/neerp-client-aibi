package com.aibi.neerp.newInstallation.invoice.entity;


import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.quotation.entity.QuotationMain;
import com.aibi.neerp.quotation.jobs.entity.JobPayment;
import com.aibi.neerp.quotation.jobs.entity.QuotationJobs;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_ni_invoice")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NiInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private Integer invoiceId;

    @Column(name = "invoice_no", nullable = false, length = 50)
    private String invoiceNo;

    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    /* =================== RELATIONS =================== */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private QuotationJobs job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private NewLeads lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combined_enquiry_id", nullable = false)
    private CombinedEnquiry combinedEnquiry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ni_quotation_id", nullable = false)
    private QuotationMain quotationMain;

    @Column(name = "quotation_no", length = 100)
    private String quotationNo;

    /* =================== TAX =================== */

    @Column(name = "sac_code", length = 20)
    private String sacCode; // 9954

    @Column(name = "base_amt", precision = 10, scale = 2)
    private BigDecimal baseAmount;

    @Column(name = "cgst_amt", precision = 10, scale = 2)
    private BigDecimal cgstAmount;

    @Column(name = "sgst_amt", precision = 10, scale = 2)
    private BigDecimal sgstAmount;

    @Column(name = "total_amt", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "pay_for", length = 255)
    private String payFor;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobPayment> payments = new ArrayList<>();


    @Column(name = "is_cleared")
    private Boolean isCleared = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private Employee createdBy;
}

