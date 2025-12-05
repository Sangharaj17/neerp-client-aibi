package com.aibi.neerp.leadmanagement.inspectionreport.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionReportDto {

    private Integer id;

    private Integer statusId;

    private Integer checkpointId;

    private Integer repeatLiftId;

    private String remark;
}
