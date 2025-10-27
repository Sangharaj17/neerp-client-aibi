package com.aibi.neerp.amc.quatation.renewal.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.aibi.neerp.amc.common.entity.ElevatorMake;
import com.aibi.neerp.amc.common.entity.NumberOfService;
import com.aibi.neerp.amc.common.entity.PaymentTerm;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.quatation.initial.entity.AmcCombinedQuotation;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.entity.NewLeads;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_revised_renewal_amc_quatation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevisedRenewalAmcQuotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "revised_renewl_id")
    private Integer revisedRenewalId;

    // -------- ManyToOne Relations --------
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amc_renewl_quatation_id", referencedColumnName = "renewl_qua_id")
    private AmcRenewalQuotation amcRenewalQuotation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_job_id", referencedColumnName = "job_id")
    private AmcJob preJobId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", referencedColumnName = "lead_id")
    private NewLeads lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combined_enquiry", referencedColumnName = "id")
    private CombinedEnquiry combinedEnquiry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enquiry_id", referencedColumnName = "enquiry_id")
    private Enquiry enquiry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", referencedColumnName = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", referencedColumnName = "site_id")
    private Site site;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "make_of_elevator", referencedColumnName = "id")
    private ElevatorMake makeOfElevator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_term", referencedColumnName = "id")
    private PaymentTerm paymentTerm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "no_of_services", referencedColumnName = "id")
    private NumberOfService numberOfService;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", referencedColumnName = "employee_id")
    private Employee createdBy;

    // -------- Simple Columns --------
    @Column(name = "quatation_date")
    private LocalDate quatationDate;

    @Column(name = "revised_edition")
    private String revisedEdition;

    @Column(name = "no_of_elevator")
    private Integer noOfElevator;

    @Column(name = "type_of_elevator", length = 255)
    private String typeOfElevator;

    @Column(name = "from_date")
    private LocalDate fromDate;

    @Column(name = "to_date")
    private LocalDate toDate;

    @Column(name = "amount_ordinary", precision = 15, scale = 2)
    private BigDecimal amountOrdinary;

    @Column(name = "gst_ordinary", precision = 15, scale = 2)
    private BigDecimal gstOrdinary;

    @Column(name = "status", length = 255)
    private String status;

    @Column(name = "is_final_ordinary", precision = 15, scale = 2)
    private BigDecimal isFinalOrdinary;

    @Column(name = "quot_final_date")
    private String quotFinalDate;

    @Column(name = "amount_semicomp", precision = 15, scale = 2)
    private BigDecimal amountSemiComp;

    @Column(name = "gst_semi", precision = 15, scale = 2)
    private BigDecimal gstSemi;

    @Column(name = "is_final_semicomp", precision = 15, scale = 2)
    private BigDecimal isFinalSemiComp;

    @Column(name = "amount_comp", precision = 15, scale = 2)
    private BigDecimal amountComp;

    @Column(name = "gst_comp", precision = 15, scale = 2)
    private BigDecimal gstComp;

    @Column(name = "is_final_comp", precision = 15, scale = 2)
    private BigDecimal isFinalComp;

    @Column(name = "type_contract", length = 255)
    private String typeContract;

    @Column(name = "gst_percentage", precision = 5, scale = 2)
    private BigDecimal gstPercentage;

    @Column(name = "gst_no", length = 50)
    private String gstNo;

    @Column(name = "is_final")
    private Integer isFinal;

    @Column(name = "job_status")
    private Integer jobStatus = 0;

    @Column(name = "forecast_month")
    private LocalDate forecastMonth;

    @Column(name = "is_revised", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isRevise = false;

    // -------- OneToMany (Lazy) --------
    @OneToMany(mappedBy = "revisedRenewal", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AmcCombinedQuotation> combinedQuotations = new ArrayList<>();
}
