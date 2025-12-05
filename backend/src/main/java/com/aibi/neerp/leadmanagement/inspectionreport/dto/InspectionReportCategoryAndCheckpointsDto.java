package com.aibi.neerp.leadmanagement.inspectionreport.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionReportCategoryAndCheckpointsDto {
	
	private InspectionReportCategoryDto inspectionReportCategoryDto;
	
	private List<InspectionCategoryCheckpointDto> inspectionCategoryCheckpointDtos;

}
