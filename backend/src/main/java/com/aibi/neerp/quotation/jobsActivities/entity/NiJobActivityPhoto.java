package com.aibi.neerp.quotation.jobsActivities.entity;

import com.aibi.neerp.employeemanagement.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_ni_job_activity_photo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NiJobActivityPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Integer photoId;

    // 🔗 FK → tbl_ni_job_activity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_activity_id", nullable = false)
    private NiJobActivity jobActivity;

    // Option 1️⃣: store file path / URL (recommended)
    @Column(name = "photo_path", nullable = false, length = 500)
    private String photoPath;

    // Option 2️⃣: store binary (only if required)
    // @Lob
    // @Basic(fetch = FetchType.LAZY)
    // @Column(name = "photo_data")
    // private byte[] photoData;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Employee createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
