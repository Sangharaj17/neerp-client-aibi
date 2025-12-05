package com.aibi.neerp.leadmanagement.inspectionreport.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_inspection_category_checkpoint")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionCategoryCheckpoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String checkpointName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private InspectionReportCategory category;
}
