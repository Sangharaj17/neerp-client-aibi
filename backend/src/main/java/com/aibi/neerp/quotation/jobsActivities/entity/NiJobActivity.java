package com.aibi.neerp.quotation.jobsActivities.entity;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.quotation.jobs.entity.QuotationJobs;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tbl_ni_job_activity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NiJobActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_activity_id")
    private Integer jobActivityId;

    // 🔗 FK → tbl_ni_job
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private QuotationJobs job;

    // 🔗 FK → tbl_job_activity_type
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_activity_type_id")
    private NiJobActivityType jobActivityType;

    @Column(name = "activity_date")
    private LocalDate activityDate;

    @Column(name = "activity_title", length = 255)
    private String activityTitle;

    @Column(name = "activity_description", columnDefinition = "TEXT")
    private String activityDescription;

    // 🔗 FK → tbl_employee
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_activity_by")
    private Employee jobActivityBy;

    @Column(name = "remark", columnDefinition = "TEXT")
    private String remark;

    @Column(name = "mail_sent")
    private Boolean mailSent = false;

    // 🔗 created by employee
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Employee createdBy;

    @Column(name = "signature_person_name")
    private String signaturePersonName;

    // ✍ Signature
    @Column(name = "signature_url")
    private String signatureUrl;

//    @Lob
//    @Basic(fetch = FetchType.LAZY)
//    @Column(name = "signature_value")
//    private byte[] signatureValue;

    // 📌 Status (ACTIVE / INACTIVE / DELETED)
    @Column(name = "status", length = 50)
    private String status = "ACTIVE";

    // ⏱ Audit
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // 📸 Photos (Max 3 enforced in service layer)
    @OneToMany(
            mappedBy = "jobActivity",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<NiJobActivityPhoto> activityPhotos;
}

