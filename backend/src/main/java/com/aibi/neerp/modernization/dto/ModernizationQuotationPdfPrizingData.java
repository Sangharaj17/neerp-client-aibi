package com.aibi.neerp.modernization.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ModernizationQuotationPdfPrizingData {
	
	private List<MaterialDetails> materialDetails;
	private BigDecimal subTotal;
	private double gstPercentage;
	private BigDecimal amountWithGst;
	private BigDecimal grandTotal;

}
