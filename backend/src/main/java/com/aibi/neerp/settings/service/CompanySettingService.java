// src/main/java/com/aibi/neerp/settings/service/CompanySettingService.java

package com.aibi.neerp.settings.service;

import com.aibi.neerp.settings.dto.CompanySettingDTO;
import com.aibi.neerp.settings.entity.CompanySetting;
import com.aibi.neerp.settings.repository.CompanySettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Optional;

@Service
public class CompanySettingService {

    private final CompanySettingRepository repository;
    
    public CompanySettingService(CompanySettingRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Optional<CompanySettingDTO> getCompanySettings(String refName) {
        return repository.findByRefName(refName)
                .map(this::convertToDTO);
    }

    @Transactional
    public CompanySettingDTO getCompanySettingsForMail(String refName) {
        return repository.findByRefName(refName)
                .map(this::convertToDTOforMail)
                .orElse(null);
    }

    @Transactional
    public CompanySettingDTO saveInitialSettings(CompanySettingDTO dto) throws IOException {
        CompanySetting entity = convertToEntity(dto);

        String incomingLogo = dto.getLogo();
        if (incomingLogo != null && !incomingLogo.isBlank()) {
            String normalized = normalizeLogoDataUrl(incomingLogo);
            entity.setLogo(normalized);
        } // else keep existing value


        CompanySetting saved = repository.save(entity);
        return convertToDTO(saved);
    }
    
    public String getCompanyLogo(String refName) {
        return repository.findById(refName)
                .map(CompanySetting::getLogo)
                .orElse(null);
    }
    
    private String normalizeLogoDataUrl(String logo) {
        // if it already contains "data:", return as-is
        if (logo.startsWith("data:")) return logo.trim();

        // if it's raw base64, add data URL prefix with default PNG mime
        // (frontend may also send the mime type; if you want to detect from content, implement detection)
        return "data:image/png;base64," + logo.trim();
    }
    
    @Transactional
    public CompanySetting getCompanySetting() {
    	
    	CompanySetting companySetting = repository.findAll().get(0);
    	
    	return companySetting;
    }

    // --- Mapper Methods ---
    
 // src/main/java/com/aibi/neerp/settings/service/CompanySettingService.java

    private CompanySettingDTO convertToDTO(CompanySetting entity) {
        CompanySettingDTO dto = new CompanySettingDTO();

        // 1. Populate Company/Contact Details
        dto.setRefName(entity.getRefName());
        dto.setCompanyOwnerName(entity.getCompanyOwnerName());
        dto.setCompanyName(entity.getCompanyName());
        dto.setOwnerNumber(entity.getOwnerNumber());
        dto.setCompanyMail(entity.getCompanyMail());
        dto.setBccMail(entity.getBccMail());

        // 2. Populate GST/Bank Details
        dto.setCompanyGst(entity.getCompanyGst());
        dto.setBankName(entity.getBankName());
        dto.setBranchName(entity.getBranchName());
        dto.setAccountNumber(entity.getAccountNumber());
        dto.setIfscCode(entity.getIfscCode());

        // 3. Populate Office/Address Details
        dto.setOfficeAddressLine1(entity.getOfficeAddressLine1());
        dto.setOfficeAddressLine2(entity.getOfficeAddressLine2());
        dto.setOfficeMail(entity.getOfficeMail());
        dto.setOfficeNumber(entity.getOfficeNumber());
        dto.setTollFreeNumber(entity.getTollFreeNumber());

        // 4. Populate GST Classification Codes (SAC/HSN)
        dto.setSacCodeAmc(entity.getSacCodeAmc());
        dto.setSacCodeNewInstallation(entity.getSacCodeNewInstallation());
        dto.setSacCodeOnCall(entity.getSacCodeOnCall());
        dto.setSacCodeModernization(entity.getSacCodeModernization());
        dto.setSacCodeMaterialRepairLabor(entity.getSacCodeMaterialRepairLabor());
        dto.setHsnCodeCommonRepairMaterial(entity.getHsnCodeCommonRepairMaterial());

        // 5. Populate Manually Configurable GST Rates (Total Percentage)
        dto.setGstRateAmcTotalPercentage(entity.getGstRateAmcTotalPercentage());
        dto.setGstRateNewInstallationTotalPercentage(entity.getGstRateNewInstallationTotalPercentage());
        dto.setGstRateRepairTotalPercentage(entity.getGstRateRepairTotalPercentage());
        
        dto.setLogo(entity.getLogo()); // already stored as data URL (or normalized)

        
        return dto;
    }

    private CompanySetting convertToEntity(CompanySettingDTO dto) {
        CompanySetting entity = new CompanySetting();

        // --- BASIC INFO ---
        entity.setRefName(dto.getRefName());
        entity.setCompanyOwnerName(dto.getCompanyOwnerName());
        entity.setCompanyName(dto.getCompanyName());
        entity.setOwnerNumber(dto.getOwnerNumber());
        entity.setCompanyMail(dto.getCompanyMail());
        entity.setBccMail(dto.getBccMail());
        entity.setCompanyGst(dto.getCompanyGst());

        // --- BANK DETAILS ---
        entity.setBankName(dto.getBankName());
        entity.setBranchName(dto.getBranchName());
        entity.setAccountNumber(dto.getAccountNumber());
        entity.setIfscCode(dto.getIfscCode());

        // --- OFFICE DETAILS ---
        entity.setOfficeAddressLine1(dto.getOfficeAddressLine1());
        entity.setOfficeAddressLine2(dto.getOfficeAddressLine2());
        entity.setOfficeMail(dto.getOfficeMail());
        entity.setOfficeNumber(dto.getOfficeNumber());
        entity.setTollFreeNumber(dto.getTollFreeNumber());

        // --- GST / HSN / SAC CODES ---
        entity.setSacCodeAmc(dto.getSacCodeAmc());
        entity.setSacCodeNewInstallation(dto.getSacCodeNewInstallation());
        entity.setSacCodeOnCall(dto.getSacCodeOnCall());
        entity.setSacCodeModernization(dto.getSacCodeModernization());
        entity.setSacCodeMaterialRepairLabor(dto.getSacCodeMaterialRepairLabor());
        entity.setHsnCodeCommonRepairMaterial(dto.getHsnCodeCommonRepairMaterial());

        // --- GST RATES ---
        entity.setGstRateAmcTotalPercentage(dto.getGstRateAmcTotalPercentage());
        entity.setGstRateNewInstallationTotalPercentage(dto.getGstRateNewInstallationTotalPercentage());
        entity.setGstRateRepairTotalPercentage(dto.getGstRateRepairTotalPercentage());

        return entity;
    }

    public Double getCompanyNI_QuotTax(String refName) {
        return repository.findById(refName)
                .map(CompanySetting::getGstRateNewInstallationTotalPercentage)
                .orElse(null);
    }
    public String getCompanyName(String refName) {
        return repository.findById(refName)
                .map(CompanySetting::getCompanyName)
                .orElse(null);
    }
    
    public String getCompanyOwnerName(String refName) {
        return repository.findById(refName)
                .map(CompanySetting::getCompanyOwnerName)
                .orElse(null);
    }
    
    public String getOwnerNumber(String refName) {
        return repository.findById(refName)
                .map(CompanySetting::getOwnerNumber)
                .orElse(null);
    }
    
    public String getCompanyMail(String refName) {
        return repository.findById(refName)
                .map(CompanySetting::getCompanyMail)
                .orElse(null);
    }

    private CompanySettingDTO convertToDTOforMail(CompanySetting entity) {
        CompanySettingDTO dto = new CompanySettingDTO();

        dto.setRefName(entity.getRefName());
        dto.setCompanyOwnerName(entity.getCompanyOwnerName());
        dto.setCompanyName(entity.getCompanyName());
        dto.setOwnerNumber(entity.getOwnerNumber());
        dto.setCompanyMail(entity.getCompanyMail());
        dto.setBccMail(entity.getBccMail());

        dto.setLogo(entity.getLogo());


        return dto;
    }

}