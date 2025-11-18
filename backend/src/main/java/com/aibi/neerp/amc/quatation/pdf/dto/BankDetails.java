package com.aibi.neerp.amc.quatation.pdf.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BankDetails {
	
	private String accountName;
	private String bankName;
	private String branchName;
	private String accountNumber;
	private String ifscCode;
	private String gstNumber;

}
