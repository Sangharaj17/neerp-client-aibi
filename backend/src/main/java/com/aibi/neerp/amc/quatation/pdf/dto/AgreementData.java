package com.aibi.neerp.amc.quatation.pdf.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AgreementData {
	
	private String sitename;
	private String typeOfContract;
	private String priceOfContract;
	private String contractPeriod;
	private String paymentTerm;
	private String nameOfPerson;
	private String mobileNumber;
    private String forCustomerSealAndSignatureLogo; 

}
