package com.aibi.neerp.modernization.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.aibi.neerp.amc.quatation.pdf.dto.AmcQuotationPdfHeadingWithContentsDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ModernizatationQuotationPdfData {
	
	private String refNo;
	private LocalDate quotationDate;
	// to
	private String sitename;
	private String siteAddress;
	private String kindAttention;
	private String subject;
	
	private String customerName;
	private String customerNumber;
	private String customerAddress;
	
	private String amountInWords;
	
	private String companyName;
	
	private ModernizationQuotationPdfPrizingData modernizationQuotationPdfPrizingData;
	
	private List<AmcQuotationPdfHeadingWithContentsDto> modernizationQuotationPdfHeadingWithContentsDtos;

	

}
