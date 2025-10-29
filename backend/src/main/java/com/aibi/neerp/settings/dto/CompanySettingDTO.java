// src/main/java/com/aibi/neerp/settings/dto/CompanySettingDTO.java

package com.aibi.neerp.settings.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CompanySettingDTO {

    private String refName;
    private String companyOwnerName;
    private String companyName;
    private String ownerNumber;
    private String companyMail;
    private String bccMail;
    private String companyGst;
    private String bankName;
    private String branchName;
    private String accountNumber;
    private String ifscCode;
    private String officeAddressLine1;
    private String officeAddressLine2;
    private String officeMail;
    private String officeNumber;
    private String tollFreeNumber;
    
    // --- GST Classification Codes (Required for Invoicing) ---
    private String sacCodeAmc; 
    private String sacCodeNewInstallation;
    private String sacCodeOnCall; 
    private String sacCodeModernization; 
    private String sacCodeMaterialRepairLabor; 
    private String hsnCodeCommonRepairMaterial; 
    
    // --- MANUALLY CONFIGURABLE GST RATES (User Request) ---
    // Store the TOTAL GST rate (e.g., 18.0) for easy manual changes.
    private Double gstRateAmcTotalPercentage;
    private Double gstRateNewInstallationTotalPercentage;
    private Double gstRateRepairTotalPercentage; 
}