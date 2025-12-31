package com.aibi.neerp.quotation.jobs.entity;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.newInstallation.invoice.entity.NiInvoice;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_ni_job_payment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    /* ================= RELATIONS ================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private QuotationJobs job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private NiInvoice invoice;

    /* ================= PAYMENT DETAILS ================= */

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "invoice_no", length = 50, nullable = false)
    private String invoiceNo;

    @Column(name = "pay_for", length = 255)
    private String payFor;

    @Column(name = "payment_type", length = 20)
    private String paymentType; // Cash / Cheque / DD / NEFT

    @Column(name = "cheque_no", length = 100)
    private String chequeNo;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "branch_name", length = 100)
    private String branchName;

    @Column(name = "amount_paid", precision = 10, scale = 2, nullable = false)
    private BigDecimal amountPaid;

    @Column(name = "payment_cleared")
    private Boolean paymentCleared;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private Employee createdBy;

    /* ================= SAFETY ================= */

    @PrePersist
    public void prePersist() {
        if (paymentCleared == null) {
            paymentCleared = false;
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

