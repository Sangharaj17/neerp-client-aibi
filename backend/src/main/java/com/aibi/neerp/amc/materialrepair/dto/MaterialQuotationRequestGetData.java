package com.aibi.neerp.amc.materialrepair.dto;

import java.math.BigDecimal;
import java.util.List;

import com.aibi.neerp.amc.materialrepair.entity.WorkPeriod;

import lombok.Data;

@Data
public class MaterialQuotationRequestGetData {
	
	private double gst;
	private String hsnCode;
	
	private List<WorkPeriod> workPeriods;

}
