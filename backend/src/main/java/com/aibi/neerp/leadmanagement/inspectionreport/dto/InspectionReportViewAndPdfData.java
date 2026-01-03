package com.aibi.neerp.leadmanagement.inspectionreport.dto;

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
public class InspectionReportViewAndPdfData {
	
	private String categoryName;
	private String checkPointName;
	private String checkPointStatus;
	private String liftname;
	private String remark;

}
