package com.aibi.neerp.quotation.entity;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.quotation.utility.QuotationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "tbl_quotation_main",
        uniqueConstraints = {
                // CRITICAL: Composite unique key for the revision system
                @UniqueConstraint(columnNames = {"quotation_no", "edition"})
        },
        indexes = {
                // Indexes for fast searching and filtering
                @Index(name = "idx_quotation_no", columnList = "quotation_no"),
                @Index(name = "idx_status", columnList = "status"),
                @Index(name = "idx_created_at", columnList = "created_at"),
                @Index(name = "idx_parent_quotation", columnList = "parent_quotation_id"),
                @Index(name = "idx_is_superseded", columnList = "is_superseded")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationMain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 🔹 Reference hierarchy
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", referencedColumnName = "lead_id", nullable = false)
    private NewLeads lead;

    @Column(name = "lead_type_id", length = 50)
    private String leadTypeId;

    @Column(name = "lead_date")
    private LocalDateTime leadDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combined_enquiry_id", referencedColumnName = "id", nullable = false)
    private CombinedEnquiry combinedEnquiry;

    @Column(name = "enquiry_type_id")
    private Integer enquiryTypeId;

    @Column(name = "customer_name", length = 100, nullable = false)
    private String customerName;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "site_name", length = 100, nullable = false)
    private String siteName;

    @Column(name = "site_id")
    private Integer siteId;

    // 🔹 Quotation metadata
    @Column(name = "quotation_no", length = 100, nullable = false)
    private String quotationNo;

    @Column(name = "quotation_date", nullable = false)
    private LocalDateTime quotationDate;

    @Column(name = "edition")
    private Integer edition = 0; // e.g. Rev 1, Rev 2, etc.

    @Column(name = "total_amount")
    private Double totalAmount;

    @Enumerated(EnumType.STRING) // 💡 Tells JPA to store the enum name (e.g., "SAVED")
    @Column(name = "status", nullable = false, length = 20)
    private QuotationStatus status;

    // 💡 REVISION: Link to the previous revision (NULL for first edition)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_quotation_id")
    private QuotationMain parentQuotation;

    // 💡 REVISION: Flag to mark this edition as replaced
    @Column(name = "is_superseded", nullable = false)
    @ColumnDefault("false")
    private Boolean isSuperseded = false;

    @Column(name = "is_finalized", nullable = false)
    @ColumnDefault("false") // 💡 Hibernate specific for DDL generation
    private Boolean isFinalized = false; // Still good practice to set Java default

    @Column(name = "is_deleted", nullable = false)
    @ColumnDefault("false")
    private Boolean isDeleted = false;

    @Column(name = "remarks", length = 500)
    private String remarks;

    @Column(name = "job_status")
    private Integer jobStatus;

    // 🔹 Created / updated info
    // 💡 REVISION: Audit fields for the revision event
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "revised_by", referencedColumnName = "employee_id")
    private Employee revisedBy;

    @Column(name = "revised_at")
    private LocalDateTime revisedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", referencedColumnName = "employee_id")
    private Employee createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "finalized_by", referencedColumnName = "employee_id")
    private Employee finalizedBy;

    @Column(name = "finalized_at")
    private LocalDateTime finalizedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deleted_by", referencedColumnName = "employee_id")
    private Employee deletedBy;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // 🔹 Relation to Lift Details (1-to-Many FK relationship)
    @OneToMany(mappedBy = "quotationMain", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuotationLiftDetail> liftDetails = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

