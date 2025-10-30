package com.aibi.neerp.amc.materialrepair.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;

@Entity
@Table(name = "tbl_mod_quot")
@Data 
@NoArgsConstructor
@AllArgsConstructor
public class MaterialQuotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer modQuotId;

    private String quatationNo;
    private LocalDate quatationDate;
    
    // --- UPDATED FK FIELDS ---
    
    // 1. Foreign Key to AmcJob (Job Header)
    // Replaces Integer jobId
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false) 
    private AmcJob amcJob; // Relationship using the AmcJob entity
    
    // 2. Foreign Key to AmcRenewalJob (New Field)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_renewl_id") // The column name in tbl_mod_quot
    private AmcRenewalJob amcRenewalJob; // New relationship
    
    // -------------------------

  
    private String note;
    private Integer gst;
 // 3. REPLACED STRING: Foreign Key to WorkPeriod (WorkPeriod Entity)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_period_id") // New foreign key column name
    private WorkPeriod workPeriodEntity; // Renamed to avoid confusion with old string
    // -----------------------------------------------------    private Boolean isFinal;
    private LocalDate quotFinalDate;
    
    private Integer isFinal;

    @OneToMany(mappedBy = "materialQuotation", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<QuotationDetail> details;
}