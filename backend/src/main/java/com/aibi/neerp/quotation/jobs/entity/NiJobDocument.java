package com.aibi.neerp.quotation.jobs.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_ni_job_document")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NiJobDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** FK to Job */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private QuotationJobs job;

    /** Job number or Job ID */
    @Column(name = "job_no", nullable = false)
    private String jobNo;

    /** Original document name */
    @Column(name = "document_name", nullable = false)
    private String documentName;

    /** Cloudinary / S3 / R2 file URL */
    @Column(name = "file_path", nullable = false, length = 1000)
    private String filePath;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "status")
    private String status;

    /** Document added date (business date) */
    @Column(name = "doc_add_date")
    private LocalDateTime docAddDate;

    /** Username / employee code */
    @Column(name = "added_by")
    private String docAddedBy;

    @PrePersist
    protected void onCreate() {
        if (this.docAddDate == null) {
            this.docAddDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "ACTIVE";
        }
    }
}

