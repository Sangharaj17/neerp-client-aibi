package com.aibi.neerp.oncall.dto;

import java.math.BigDecimal;
import java.util.List;

import com.aibi.neerp.modernization.dto.MaterialDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OncallQuotationPdfPrizingData {
	
	private List<MaterialDetails> materialDetails;
	private BigDecimal subTotal;
	private double gstPercentage;
	private BigDecimal amountWithGst;
	private BigDecimal grandTotal;

}
