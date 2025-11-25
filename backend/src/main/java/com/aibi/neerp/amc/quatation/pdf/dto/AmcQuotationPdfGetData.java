package com.aibi.neerp.amc.quatation.pdf.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.aibi.neerp.amc.jobs.initial.dto.LiftData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AmcQuotationPdfGetData {
	
	private String refNo;
	private LocalDate quotationDate;
	private String company_name;
	private String company_person_name;
	private String makeOfElavators;
	private LetterDetails letterDetails;
	
	private List<LiftData> liftSpecifications;
	
	private List<AmcQuotationPdfHeadingWithContentsDto> amcQuotationPdfHeadingWithContentsDtos;
	private AllContractTypeOfPricingData allContractTypeOfPricingData;
	private BankDetails bankDetails;
	private AgreementData agreementData;
	

}
