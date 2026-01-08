package com.aibi.neerp.amc.invoice.entity;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.amc.materialrepair.entity.MaterialQuotation;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import com.aibi.neerp.modernization.entity.Modernization;
import com.aibi.neerp.oncall.entity.OnCallQuotation;

@Entity
@Table(name = "tbl_amc_invoice") 
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcInvoice { 

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private Integer invoiceId;

    @Column(name = "invoice_no", length = 255) // nullable = false removed
    private String invoiceNo;

    @Column(name = "invoice_date") // nullable = false removed
    private LocalDate invoiceDate;

    // Foreign Key Relationship to AmcJob (Job ID)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_no", referencedColumnName = "job_id") // nullable = false removed
    private AmcJob amcJob; 

    // Foreign Key Relationship to AmcRenewalJob (Renewal Job ID)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renewl_job_id", referencedColumnName = "job_renewl_id")
    private AmcRenewalJob amcRenewalJob;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enquiry_type_id", referencedColumnName = "enquiry_type_id")
    private EnquiryType enquiryType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_quotation_id")
    private MaterialQuotation materialQuotation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "on_call_quotation_id")
    private OnCallQuotation onCallQuotation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modernization_id")
    private Modernization modernization;


    @Lob 
    @Column(name = "desc_of_service") // nullable = false removed
    private String descOfService;

    @Column(name = "sac_code", length = 255) // nullable = false removed
    private String sacCode;

    @Column(name = "base_amt", precision = 10, scale = 2) // nullable = false removed
    private BigDecimal baseAmt;

    @Column(name = "cgst_amt", precision = 10, scale = 2) // nullable = false removed
    private BigDecimal cgstAmt;

    @Column(name = "sgst_amt", precision = 10, scale = 2) // nullable = false removed
    private BigDecimal sgstAmt;

    @Column(name = "total_amt", precision = 10, scale = 2) // nullable = false removed
    private BigDecimal totalAmt;

    @Column(name = "pay_for", length = 255) // nullable = false removed
    private String payFor;

    @Column(name = "is_cleared") // nullable = false removed
    private Integer isCleared;
    
    @Column(name = "is_payment_entry_added") // nullable = false removed
    private Integer isPaymentEntryAdded = 0;
    
}