package com.aibi.neerp.amc.jobs.renewal.entity;


import java.math.BigDecimal;
import java.time.LocalDate;

import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.entity.Routes;
import com.aibi.neerp.amc.quatation.renewal.entity.AmcRenewalQuotation;
import com.aibi.neerp.amc.quatation.renewal.entity.RevisedRenewalAmcQuotation;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.leadmanagement.entity.NewLeads;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_amc_renewl_job")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcRenewalJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_renewl_id")
    private Integer renewalJobId;

    // ---------- Foreign Keys ----------

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private NewLeads lead;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_job_id", referencedColumnName = "job_id")
    private AmcJob preJobId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renewl_qua_id")
    private AmcRenewalQuotation amcRenewalQuotation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "revised_renewl_id")
    private RevisedRenewalAmcQuotation revisedRenewalAmcQuotation;

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

    @Column(nullable = false)
    private String contractType;

    @Column(nullable = false)
    private String makeOfElevator;

    @Column(nullable = false)
    private Integer noOfElevator;

    @Column(nullable = false)
    private String jobNo;

    @Column(nullable = false)
    private String customerGstNo;

    @Column(nullable = false)
    private String jobType;

    // Dates as Strings
    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column
    private LocalDate dealDate;

    @Column(nullable = false)
    private Integer noOfServices;

    @Column(nullable = false, precision = 38, scale = 2)
    private BigDecimal jobAmount;

    @Column(nullable = false)
    private String amountWithGst;

    @Column(nullable = false)
    private String amountWithoutGst;

    @Column(nullable = false)
    private String paymentTerm;

    @Column(nullable = false)
    private Integer gstPercentage;

    @Column(nullable = false)
    private String jobLiftDetail;

    @Column(nullable = false)
    private String jobStatus;

    @Column(nullable = false)
    private Boolean status;

    @Column
    private String renewalRemark;

    @Column
    private Boolean isNew;

    @Column
    private Integer currentServiceNumber;
    
    @Column
    private Integer noOfLifsServiceNeedToCompleteCount;
    
    @Column
    private Integer noOfLiftsCurrentServiceCompletedCount;
    
    // Legacy column name - keep explicit as it doesn't match strategy output
    @Column(name = "lastactivitydate")
    private LocalDate lastActivityDate;
    
    // Legacy column name - keep explicit as it doesn't match strategy output
    @Column(name = "currentservicestatus")
    private String currentServiceStatus;
    
    
    @Column
    private BigDecimal receivedAmount;

    @Column
    private BigDecimal balanceAmount;

    @Column
    private Integer pendingServiceCount;
    
    @Column
    private LocalDate previousServicingDate;
    
    @Column
    private Boolean isRenewalQuatationCreated = false;
    
    
    
}


