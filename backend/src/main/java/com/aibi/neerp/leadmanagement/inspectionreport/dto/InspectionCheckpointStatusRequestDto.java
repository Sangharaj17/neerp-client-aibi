package com.aibi.neerp.leadmanagement.inspectionreport.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionCheckpointStatusRequestDto {

    private List<InspectionCheckpointStatusDto> inspectionCheckpointStatusDtos;
}