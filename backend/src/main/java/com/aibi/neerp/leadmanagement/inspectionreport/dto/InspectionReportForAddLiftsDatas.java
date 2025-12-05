package com.aibi.neerp.leadmanagement.inspectionreport.dto;

import java.util.List;

import com.aibi.neerp.amc.jobs.initial.dto.LiftData;

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
public class InspectionReportForAddLiftsDatas {
	
	private List<LiftData> liftDatas;
	

}
