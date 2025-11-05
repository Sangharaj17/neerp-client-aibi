package com.aibi.neerp.oncall.dto;

import java.util.List;

import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.materialrepair.entity.WorkPeriod;

import lombok.Data;

@Data
public class OncallRequestDtoPreData {
	
	private String QuotationNo;
	private String JobId;
	private List<WorkPeriod> workPeriods;
	private String hsn_sac_code;
	
	
	private List<LiftData> liftDatas;
	

}
