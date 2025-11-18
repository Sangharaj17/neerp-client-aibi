package com.aibi.neerp.amc.quatation.pdf.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LiftPricingData {
	
	private String productDescription;
	private String typeOfContract;
	private BigDecimal pricePerLift;
	private Integer noOfLifts;
	private BigDecimal totalAmount;

}
