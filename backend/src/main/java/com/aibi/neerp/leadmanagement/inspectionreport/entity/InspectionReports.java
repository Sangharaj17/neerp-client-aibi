package com.aibi.neerp.leadmanagement.inspectionreport.entity;


import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing the inspection_reports table.
 */
@Entity
@Table(name = "tbl_inspection_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionReports {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    /**
     * Foreign key to CombinedEnquiry (many-to-one, lazy).
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "combined_enquiry_id", referencedColumnName = "id", nullable = false)
    private CombinedEnquiry combinedEnquiry;

    /**
     * Edition / version of the report.
     */
    @Column(name = "report_edition", nullable = false)
    private String reportEdition;
}
