package com.aibi.neerp.quotation.jobs.entity;

import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.quotation.entity.QuotationMain;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tbl_ni_job")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationJobs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Integer jobId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private NewLeads lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combined_enquiry_id", referencedColumnName = "id", nullable = false)
    private CombinedEnquiry combinedEnquiry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ni_quotation_id")
    private QuotationMain niQuotation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_engineer_id")
    private Employee serviceEngineer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_executive_id")
    private Employee salesExecutive;

    @Column(nullable = false)
    private String jobNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_type_id", nullable = false)
    private EnquiryType jobType;

    @Column(nullable = false, precision = 38, scale = 2)
    private BigDecimal jobAmount;

    @Column(nullable = false)
    private String jobStatus;

    @Column(nullable = false)
    private String jobLiftDetail;

    @Column(nullable = false)
    private String paymentTerm;

    @Column(nullable = false)
    private String customerGstNo;

    // Dates as Strings
    @Column(nullable = false)
    private LocalDate startDate;

    @Column
    private LocalDate dealDate;

    @Column(name = "is_handover")
    private Boolean isHandover;

    @Column(name = "handover_date")
    private LocalDate handoverDate;

    @Column(name = "pwd_status", length = 255)
    private String pwdStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private Employee createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDate createdAt = LocalDate.now();

    @Column(name = "pwd_act_date")
    private LocalDate pwdActDate;
}
