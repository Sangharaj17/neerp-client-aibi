package com.aibi.neerp.modernization.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aibi.neerp.modernization.dto.*;
import com.aibi.neerp.modernization.entity.*;
import com.aibi.neerp.modernization.repository.*;
import com.aibi.neerp.settings.entity.CompanySetting;
import com.aibi.neerp.settings.repository.CompanySettingRepository;
import com.aibi.neerp.settings.service.CompanySettingService;

import jakarta.persistence.EntityNotFoundException;

import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;
import com.aibi.neerp.amc.materialrepair.entity.WorkPeriod;
import com.aibi.neerp.amc.materialrepair.repository.WorkPeriodRepository;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.leadmanagement.repository.CombinedEnquiryRepository;
import com.aibi.neerp.leadmanagement.repository.EnquiryRepository;
import com.aibi.neerp.leadmanagement.repository.NewLeadsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ModernizationService {

    private final ModernizationRepository modernizationRepository;
    private final ModernizationDetailRepository modernizationDetailRepository;

    private final NewLeadsRepository newLeadsRepository;
    private final EnquiryRepository enquiryRepository;
    private final CombinedEnquiryRepository combinedEnquiryRepository;
    private final WorkPeriodRepository workPeriodRepository;
    
    private final CompanySettingService companySettingService;
    private final AmcJobsService amcJobsService;

    // --- CREATE Modernization with Details ---
    @Transactional
    public ModernizationResponseDto createModernization(ModernizationRequestDto requestDto) {

        ModernizationDto dto = requestDto.getModernization();
        List<ModernizationDetailDto> detailDtos = requestDto.getDetails();

        // --- Map DTO to Entity ---
        Modernization modernization = new Modernization();
        modernization.setQuotationNo(dto.getQuotationNo());
        modernization.setQuotationDate(dto.getQuotationDate());
        modernization.setJobId(dto.getJobId());
        modernization.setNote(dto.getNote());
        modernization.setGst(dto.getGst());
        modernization.setWarranty(dto.getWarranty());
        modernization.setAmount(dto.getAmount());
        modernization.setAmountWithGst(dto.getAmountWithGst());
        modernization.setIsFinal(dto.getIsFinal());
        modernization.setQuotationFinalDate(dto.getQuotationFinalDate());
        modernization.setGstApplicable(dto.getGstApplicable());
        modernization.setGstPercentage(dto.getGstPercentage());
        modernization.setSubtotal(dto.getSubtotal());
        modernization.setGstAmount(dto.getGstAmount());

        // --- Set Foreign Keys ---
        if (dto.getLeadId() != null)
            modernization.setLead(newLeadsRepository.findById(dto.getLeadId()).orElse(null));

        if (dto.getEnquiryId() != null)
            modernization.setEnquiry(enquiryRepository.findById(dto.getEnquiryId()).orElse(null));

        if (dto.getCombinedEnquiryId() != null)
            modernization.setCombinedEnquiry(combinedEnquiryRepository.findById(dto.getCombinedEnquiryId()).orElse(null));

        if (dto.getWorkPeriodId() != null)
            modernization.setWorkPeriodEntity(workPeriodRepository.findById(dto.getWorkPeriodId()).orElse(null));

        // --- Save parent ---
        Modernization savedModernization = modernizationRepository.save(modernization);

        // --- Save details ---
        List<ModernizationDetail> savedDetails = null;
        if (detailDtos != null && !detailDtos.isEmpty()) {
            savedDetails = detailDtos.stream()
                    .map(d -> ModernizationDetail.builder()
                            .modernization(savedModernization)
                            .materialName(d.getMaterialName())
                            .hsn(d.getHsn())
                            .quantity(d.getQuantity())
                            .uom(d.getUom())
                            .rate(d.getRate())
                            .amount(d.getAmount())
                            .guarantee(d.getGuarantee())
                            .build())
                    .collect(Collectors.toList());
            modernizationDetailRepository.saveAll(savedDetails);
        }

        // --- Build response DTO ---
        ModernizationResponseDto response = ModernizationResponseDto.builder()
                .modernization(dto)
                .details(detailDtos)
                .build();

        return response;
    }
    
    
    public ModernizationRequestDtoPreData getModernizationRequestDtoPreData(Integer combinedEnqId) {
        
        // 1. Initialize the DTO
        ModernizationRequestDtoPreData modernizationRequestDtoPreData = 
                new ModernizationRequestDtoPreData();
        
        // 2. Fetch Company Settings and HSN/SAC Code
        CompanySetting companySetting = companySettingService.getCompanySetting();
        String hsnSacCode = "";
        
        if (companySetting != null) {
            // Use a more Java-convention-friendly variable name (hsnSacCode)
            hsnSacCode = companySetting.getSacCodeModernization();
        }
        
        // 3. Generate IDs
        Integer maxId = modernizationRepository.findMaxId();
       // maxId++;
        
        modernizationRequestDtoPreData.setHsn_sac_code(hsnSacCode);
        
        // **Safety Check for maxId**: Ensure maxId is not null before concatenation
        if (maxId != null) {
        	maxId++;
            modernizationRequestDtoPreData.setQuotationNo("QUO" + maxId);
            modernizationRequestDtoPreData.setJobId("JOB" + maxId);
        } else {
            // Handle case where maxId might be null (e.g., first record)
            modernizationRequestDtoPreData.setQuotationNo("QUO-1");
            modernizationRequestDtoPreData.setJobId("JOB-1");
        }
        
        // 4. Fetch Combined Enquiry (CRITICAL FIX)
        CombinedEnquiry combinedEnquiry = combinedEnquiryRepository.findById(combinedEnqId)
            .orElseThrow(() -> new EntityNotFoundException("Combined Enquiry not found with ID: " + combinedEnqId));
        
        // 5. Build Lift Data
        List<LiftData> liftDatas = amcJobsService.buildLiftData(combinedEnquiry);
        modernizationRequestDtoPreData.setLiftDatas(liftDatas);
        
        // 6. Fetch Work Periods
        List<WorkPeriod> workPeriods = workPeriodRepository.findAll();
        modernizationRequestDtoPreData.setWorkPeriods(workPeriods);
        
        return modernizationRequestDtoPreData;
    }
    
    
    public Page<ModernizationResponseDto> getAllModernizationQuotations(
            String search,
            LocalDate dateSearch,
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        String dateSearchStr = dateSearch != null ? dateSearch.toString() : null;

        Page<Modernization> results = modernizationRepository.searchAll(
                search == null ? "" : search,
                dateSearchStr,
                pageable
        );

        return results.map(this::convertToResponseDto);
    }

    private ModernizationResponseDto convertToResponseDto(Modernization entity) {

        // --- Build main Modernization DTO ---
        ModernizationDto modernizationDto = ModernizationDto.builder()
                .id(entity.getId())
                .quotationNo(entity.getQuotationNo())
                .quotationDate(entity.getQuotationDate())
                .leadId(entity.getLead() != null ? entity.getLead().getLeadId() : null)
                .enquiryId(entity.getEnquiry() != null ? entity.getEnquiry().getEnquiryId() : null)
                .combinedEnquiryId(entity.getCombinedEnquiry() != null ? entity.getCombinedEnquiry().getId() : null)
                .workPeriodId(entity.getWorkPeriodEntity() != null ? entity.getWorkPeriodEntity().getWorkPeriodId() : null)
                .jobId(entity.getJobId())
                .note(entity.getNote())
                .gst(entity.getGst())
                .warranty(entity.getWarranty())
                .amount(entity.getAmount())
                .amountWithGst(entity.getAmountWithGst())
                .isFinal(entity.getIsFinal())
                .quotationFinalDate(entity.getQuotationFinalDate())
                .gstApplicable(entity.getGstApplicable())
                .gstPercentage(entity.getGstPercentage())
                .subtotal(entity.getSubtotal())
                .gstAmount(entity.getGstAmount())
                .customerName(entity.getLead() != null ? entity.getLead().getCustomerName() : null)
                .siteName(entity.getLead() != null ? entity.getLead().getSiteName() : null)
                .build();

        // --- Convert all details to DTOs (if present) ---
        List<ModernizationDetailDto> detailDtos = null;
        if (entity.getDetails() != null && !entity.getDetails().isEmpty()) {
            detailDtos = entity.getDetails().stream()
                    .map(detail -> ModernizationDetailDto.builder()
                            .id(detail.getId())
                            .materialName(detail.getMaterialName())
                            .hsn(detail.getHsn())
                            .quantity(detail.getQuantity())
                            .uom(detail.getUom())
                            .rate(detail.getRate())
                            .amount(detail.getAmount())
                            .guarantee(detail.getGuarantee())
                            .build())
                    .toList();
        }

        // --- Build the final response DTO ---
        return ModernizationResponseDto.builder()
                .modernization(modernizationDto)
                .details(detailDtos)
                .build();
    }

    public ModernizationResponseDto getModernizationQuotationById(Integer id) {
        Modernization modernization = modernizationRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Modernization quotation not found with ID: " + id));

        return convertToResponseDto(modernization);
    }

    @Transactional
    public boolean updateIsFinalStatus(Integer id, Boolean isFinal) {
        Optional<Modernization> optional = modernizationRepository.findById(id);
        if (optional.isPresent()) {
            Modernization modernization = optional.get();
            modernization.setIsFinal(isFinal);
            modernizationRepository.save(modernization);
            return true;
        }
        return false;
    }

    
    
    
}
