package com.aibi.neerp.oncall.entity;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.aibi.neerp.amc.materialrepair.entity.WorkPeriod;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.entity.NewLeads;


import lombok.*;

@Entity
@Table(name = "tbl_oncall_quot")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnCallQuotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "oncall_quot_id")
    private Integer id;

    @Column(name = "quatation_no", length = 255)
    private String quotationNo;

    @Column(name = "quatation_date")
    private LocalDate quotationDate;

    // --- Relationships ---
    @ManyToOne
    @JoinColumn(name = "lead_id", referencedColumnName = "lead_id")
    private NewLeads lead;

    @ManyToOne
    @JoinColumn(name = "enquiry_id", referencedColumnName = "enquiry_id")
    private Enquiry enquiry;

    @ManyToOne
    @JoinColumn(name = "combined_enquiry", referencedColumnName = "id")
    private CombinedEnquiry combinedEnquiry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_period_id") // Foreign key instead of old String
    private WorkPeriod workPeriodEntity;

    @Column(name = "job_id")
    private String jobId;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "gst")
    private Integer gst;

    @Column(name = "warranty")
    private Integer warranty;

    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "amount_with_gst", precision = 10, scale = 2)
    private BigDecimal amountWithGst;

    @Column(name = "is_final")
    private Boolean isFinal;

    @Column(name = "quot_final_date")
    private LocalDate quotationFinalDate;

    @Column(name = "gst_applicable",  length = 10)
    private String gstApplicable;

    @Column(name = "gst_percentage", precision = 5, scale = 2)
    private BigDecimal gstPercentage;

    @Column(name = "subtotal", precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "gst_amount", precision = 10, scale = 2)
    private BigDecimal gstAmount;
    
    // ✅ Add this block
    @OneToMany(mappedBy = "onCallQuotation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OnCallQuotationDetail> details;
}

