package com.aibi.neerp.leadmanagement.inspectionreport.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionReportRepeatLiftDto {

    private Integer id;

    private Integer enquiryId;

    private Integer repeatLiftId;   // self-join reference

    private Integer inspectionReportsId;
}
