package com.aibi.neerp.leadmanagement.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.aibi.neerp.employeemanagement.entity.Employee;

@Entity
@Table(name = "tbl_new_leads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NewLeads {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lead_id")
    private Integer leadId;

    @Column(name = "lead_date")
    private LocalDateTime leadDate;

    @ManyToOne
    @JoinColumn(name = "activity_by", referencedColumnName = "employee_id")
    private Employee activityBy;

    @ManyToOne
    @JoinColumn(name = "lead_source", referencedColumnName = "lead_source_id")
    private LeadSource leadSource;

    @Column(name = "lead_type", length = 255)
    private String leadType;

    @Column(name = "lead_company_name", length = 255)
    private String leadCompanyName;

    @Column(name = "salutations", length = 255)
    private String salutations;

    @Column(name = "salutations2", length = 255)
    private String salutations2;

    @Column(name = "customer_name", length = 255)
    private String customerName;

    @Column(name = "customer_name2", length = 255)
    private String customerName2;

    @ManyToOne
    @JoinColumn(name = "designation", referencedColumnName = "designation_id", nullable = false)
    private Designation designation;

    @ManyToOne
    @JoinColumn(name = "designation2", referencedColumnName = "designation_id")
    private Designation designation2;

    @Column(name = "email_id", length = 255)
    private String emailId;

    @Column(name = "email_id2", length = 255)
    private String emailId2;

    @Column(name = "country_code", length = 255)
    private String countryCode;

    @Column(name = "contact_no", length = 255)
    private String contactNo;
    
    
    @Column(name = "customer1_contact", length = 255)
    private String customer1Contact;
    
    
    @Column(name = "customer2_contact", length = 255)
    private String customer2Contact;
    
    
    @Column(name = "landline_no", length = 255)
    private String landlineNo;


    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "site_name", length = 255)
    private String siteName;

    @Column(name = "site_address", length = 255)
    private String siteAddress;

    @ManyToOne
    @JoinColumn(name = "lead_stage", referencedColumnName = "stage_id")
    private LeadStage leadStage;

    @Column(name = "status", length = 255)
    private String status;
    
    @ManyToOne
    @JoinColumn(name = "lead_status", referencedColumnName = "id")
    private LeadStatus leadStatus;

    @Column(name = "reason", length = 255)
    private String reason;

    @Column(name = "is_send_quotation")
    private Integer isSendQuotation;

    @Column(name = "quatation_id")
    private Integer quatationId;

    @Column(name = "amc_quatation_id")
    private Integer amcQuatationId;

    @Column(name = "mod_quot_id")
    private Integer modQuotId;

    @Column(name = "oncall_quot_id")
    private Integer oncallQuotId;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "make_of_elevator", length = 255)
    private String makeOfElevator;

    @Column(name = "no_of_elevator")
    private Integer noOfElevator;

    @Column(name = "gst_percentage")
    private Integer gstPercentage;

    @Column(name = "amount_ordinary")
    private Double amountOrdinary;

    @Column(name = "gst_ordinary")
    private Double gstOrdinary;

    @Column(name = "total_amount_ordinary")
    private Double totalAmountOrdinary;

    @Column(name = "amount_comp")
    private Double amountComp;

    @Column(name = "gst_comp")
    private Double gstComp;

    @Column(name = "total_amount_comp")
    private Double totalAmountComp;

    @ManyToOne
    @JoinColumn(name =  "contracts" , referencedColumnName = "contract_id")
    private Contract contract;
    
    @ManyToOne
    @JoinColumn(name = "area_id", referencedColumnName = "area_id")
    private Area area;
    
    @ManyToOne
    @JoinColumn(name = "project_stage", referencedColumnName = "id")
    private ProjectStage projectStage;

    @Override
    public String toString() {
        return "NewLeads{" +
                "leadId=" + leadId +
                ", leadDate=" + leadDate +
                ", activityBy=" + activityBy +
                ", leadSource=" + leadSource +
                ", leadType='" + leadType + '\'' +
                ", leadCompanyName='" + leadCompanyName + '\'' +
                ", salutations='" + salutations + '\'' +
                ", salutations2='" + salutations2 + '\'' +
                ", customerName='" + customerName + '\'' +
                ", customerName2='" + customerName2 + '\'' +
                ", designation=" + designation +
                ", designation2=" + designation2 +
                ", emailId='" + emailId + '\'' +
                ", emailId2='" + emailId2 + '\'' +
                ", countryCode='" + countryCode + '\'' +
                ", contactNo='" + contactNo + '\'' +
                ", customer1Contact='" + customer1Contact + '\'' +
                ", customer2Contact='" + customer2Contact + '\'' +
                ", landlineNo='" + landlineNo + '\'' +
                ", address='" + address + '\'' +
                ", siteName='" + siteName + '\'' +
                ", siteAddress='" + siteAddress + '\'' +
                ", leadStage=" + leadStage +
                ", status='" + status + '\'' +
                ", leadStatus=" + leadStatus +
                ", reason='" + reason + '\'' +
                ", isSendQuotation=" + isSendQuotation +
                ", quatationId=" + quatationId +
                ", amcQuatationId=" + amcQuatationId +
                ", modQuotId=" + modQuotId +
                ", oncallQuotId=" + oncallQuotId +
                ", expiryDate=" + expiryDate +
                ", makeOfElevator='" + makeOfElevator + '\'' +
                ", noOfElevator=" + noOfElevator +
                ", gstPercentage=" + gstPercentage +
                ", amountOrdinary=" + amountOrdinary +
                ", gstOrdinary=" + gstOrdinary +
                ", totalAmountOrdinary=" + totalAmountOrdinary +
                ", amountComp=" + amountComp +
                ", gstComp=" + gstComp +
                ", totalAmountComp=" + totalAmountComp +
                ", contract=" + contract +
                ", area=" + area +
                ", projectStage=" + projectStage +
                '}';
    }
}
