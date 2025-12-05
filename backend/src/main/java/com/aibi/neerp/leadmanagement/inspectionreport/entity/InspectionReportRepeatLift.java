package com.aibi.neerp.leadmanagement.inspectionreport.entity;

import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_inspection_report_repeat_lift")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionReportRepeatLift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enquiry_id")
    private Enquiry enquiry;

    // self-join reference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repeat_lift_id")
    private InspectionReportRepeatLift repeatLift;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inspection_reports_id")
    private InspectionReports inspectionReports;
}
