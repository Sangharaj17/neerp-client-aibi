package com.aibi.neerp.amc.quatation.pdf.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContractTypeOfPricingData {
	
	private String contractType;
	
	private List<LiftPricingData> liftPricingDatas;
	
	private BigDecimal subTotalOfAllLifts;
	private BigDecimal gstPercentage;
	private BigDecimal gstAmountOfLifts;
	private BigDecimal totalPriceWithTax;
	
	private String totalPriceWithTaxInWords;

}
