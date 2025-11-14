// src/main/java/com/aibi/neerp/settings/entity/CompanySetting.java

package com.aibi.neerp.settings.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "company_settings")
@Data
@NoArgsConstructor
public class CompanySetting {

    @Id 
    @Column(name = "refname")
    private String refName;
    
    // ✅ Store Base64 Logo as TEXT (instead of bytes)
    @Lob
    @Column(columnDefinition = "TEXT")
    private String logo;

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
    
    // --- GST Classification Codes ---
    private String sacCodeAmc = "998718";
    private String sacCodeNewInstallation = "995466";
    private String sacCodeOnCall = "998718";
    private String sacCodeModernization = "995466";
    private String sacCodeMaterialRepairLabor = "998718";
    private String hsnCodeCommonRepairMaterial = "84281090";

    // --- MANUALLY CONFIGURABLE GST RATES (User Request) ---
    // Total rate for services (defaults to 18.0%)
    private Double gstRateAmcTotalPercentage = 18.0;
    private Double gstRateNewInstallationTotalPercentage = 18.0;
    private Double gstRateRepairTotalPercentage = 18.0;
}