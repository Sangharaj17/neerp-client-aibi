package com.aibi.neerp.leadmanagement.inspectionreport.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_inspection_report")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id")
    private InspectionCheckpointStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checkpoint_id")
    private InspectionCategoryCheckpoint checkpoint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repeat_lift_id")
    private InspectionReportRepeatLift repeatLift;

    @Column(length = 500)
    private String remark;
}
