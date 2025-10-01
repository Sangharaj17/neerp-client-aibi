package com.aibi.neerp.amc.jobs.initial.entity;


import java.math.BigDecimal;
import java.time.LocalDate;

import com.aibi.neerp.amc.quatation.initial.entity.AmcQuotation;
import com.aibi.neerp.amc.quatation.initial.entity.RevisedAmcQuotation;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.leadmanagement.entity.NewLeads;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_amc_job")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Integer jobId;

    // ---------- Foreign Keys ----------

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private NewLeads lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amc_quatation_id")
    private AmcQuotation amcQuotation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "revised_quatation_id")
    private RevisedAmcQuotation revisedAmcQuotation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_engineer_id")
    private Employee serviceEngineer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_executive_id")
    private Employee salesExecutive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    private Routes route;

    // ---------- Other Columns ----------

    @Column(name = "renewl_status", nullable = false)
    private Integer renewlStatus;

    @Column(name = "contract_type", nullable = false)
    private String contractType;

    @Column(name = "make_of_elevator", nullable = false)
    private String makeOfElevator;

    @Column(name = "no_of_elevator", nullable = false)
    private Integer noOfElevator;

    @Column(name = "job_no", nullable = false)
    private String jobNo;

    @Column(name = "customer_gst_no", nullable = false)
    private String customerGstNo;

    @Column(name = "job_type", nullable = false)
    private String jobType;

    // Dates as Strings
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "deal_date")
    private LocalDate dealDate;

    @Column(name = "no_of_services", nullable = false)
    private Integer noOfServices;

    @Column(name = "job_amount", nullable = false)
    private String jobAmount;

    @Column(name = "amount_with_GST", nullable = false)
    private String amountWithGst;

    @Column(name = "amount_without_GST", nullable = false)
    private String amountWithoutGst;

    @Column(name = "payment_term", nullable = false)
    private String paymentTerm;

    @Column(name = "gst_percentage", nullable = false)
    private Integer gstPercentage;

    @Column(name = "job_lift_detail", nullable = false)
    private String jobLiftDetail;

    @Column(name = "job_status", nullable = false)
    private String jobStatus;

    @Column(name = "status", nullable = false)
    private Boolean status;

    @Column(name = "renewal_remark")
    private String renewalRemark;

    @Column(name = "is_new")
    private Boolean isNew;

    @Column(name = "current_service_number")
    private Integer currentServiceNumber;
    
    @Column(name = "noOfLifsServiceNeedToCompleteCount")
    private Integer noOfLifsServiceNeedToCompleteCount;
    
    @Column(name = "noOfLiftsCurrentServiceCompletedCount")
    private Integer noOfLiftsCurrentServiceCompletedCount;
    
    @Column(name = "lastActivityDate")
    private LocalDate lastActivityDate;
    
    @Column(name = "currentServiceStatus")
    private String currentServiceStatus;
    
    
    @Column(name = "received_amount")
    private BigDecimal receivedAmount;

    @Column(name = "balance_amount")
    private BigDecimal balanceAmount;

    @Column(name = "pending_service_count")
    private Integer pendingServiceCount;
    
    @Column(name = "previous_servicing_date")
    private LocalDate previousServicingDate;
    
}

