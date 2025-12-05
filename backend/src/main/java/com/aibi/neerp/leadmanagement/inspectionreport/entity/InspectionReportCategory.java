package com.aibi.neerp.leadmanagement.inspectionreport.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_inspection_report_category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionReportCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String categoryName;
}
