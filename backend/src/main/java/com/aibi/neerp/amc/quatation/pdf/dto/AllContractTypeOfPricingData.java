package com.aibi.neerp.amc.quatation.pdf.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllContractTypeOfPricingData {
	
	private List<ContractTypeOfPricingData> contractTypeOfPricingDatas;
   
}
