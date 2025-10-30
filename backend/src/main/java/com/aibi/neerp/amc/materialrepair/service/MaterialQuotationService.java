package com.aibi.neerp.amc.materialrepair.service;

import com.aibi.neerp.amc.materialrepair.dto.*;
import com.aibi.neerp.amc.materialrepair.entity.*;
import com.aibi.neerp.amc.materialrepair.repository.MaterialQuotationRepository;
import com.aibi.neerp.amc.materialrepair.repository.WorkPeriodRepository;
import com.aibi.neerp.settings.entity.CompanySetting;
import com.aibi.neerp.settings.repository.CompanySettingRepository;
import com.aibi.neerp.settings.service.CompanySettingService;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobRepository;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MaterialQuotationService {

    private final MaterialQuotationRepository materialQuotationRepository;
    private final AmcJobRepository amcJobRepository;
    private final AmcRenewalJobRepository amcRenewalJobRepository;
    private final WorkPeriodRepository workPeriodRepository;
    private final WorkPeriodService workPeriodService;
    private final CompanySettingService companySettingService;
    private final CompanySettingRepository companySettingRepository;

    // 🔹 GET ALL with Pagination, Sorting & Search
    public Page<MaterialQuotationResponseDto> getAllMaterialQuotations(
            String search,
            LocalDate dateSearch,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        String dateSearchStr = dateSearch != null ? dateSearch.toString() : null;

        Page<MaterialQuotation> results = materialQuotationRepository.searchAll(
                search == null ? "" : search,
                dateSearchStr,
                pageable
        );

        return results.map(this::convertToResponseDto);
    }

    // 🔹 SAVE Quotation
    public MaterialQuotationResponseDto saveMaterialQuotation(MaterialQuotationRequestDto dto) {
        MaterialQuotation quotation = new MaterialQuotation();

        // 1️⃣ Set all basic fields
        quotation.setQuatationNo(dto.getQuatationNo()); // temporary, will update later
        quotation.setQuatationDate(dto.getQuatationDate());
        quotation.setNote(dto.getNote());
        quotation.setGst(dto.getGst());
        
        WorkPeriod workPeriod = null;
        
        if(dto.getWorkPeriodId()!=null) {
        	workPeriod = workPeriodRepository.findById(dto.getWorkPeriodId()).get();
        }
        
        quotation.setWorkPeriodEntity(workPeriod);
        quotation.setIsFinal(0);
        quotation.setQuotFinalDate(dto.getQuotFinalDate());

        // 2️⃣ Set relationships
        if (dto.getJobId() != null)
            quotation.setAmcJob(amcJobRepository.findById(dto.getJobId()).orElse(null));

        if (dto.getJobRenewlId() != null)
            quotation.setAmcRenewalJob(amcRenewalJobRepository.findById(dto.getJobRenewlId()).orElse(null));

        // 3️⃣ Map detail list
        if (dto.getDetails() != null) {
            quotation.setDetails(dto.getDetails().stream().map(detailDto -> {
                QuotationDetail detail = new QuotationDetail();
                detail.setMaterialName(detailDto.getMaterialName());
                detail.setHsn(detailDto.getHsn());
                detail.setQuantity(detailDto.getQuantity());
                detail.setRate(detailDto.getRate());
                detail.setAmount(detailDto.getAmount());
                detail.setGuarantee(detailDto.getGuarantee());
                detail.setMaterialQuotation(quotation);
                return detail;
            }).collect(Collectors.toList()));
        }

        // 4️⃣ Save first to generate ID
        MaterialQuotation saved = materialQuotationRepository.save(quotation);

        // 5️⃣ Generate formatted quotation number
        String formattedNo = generateQuotationNo(saved.getModQuotId());

        // 6️⃣ Update quotation number
        saved.setQuatationNo(formattedNo);
        MaterialQuotation updated = materialQuotationRepository.save(saved);

        // 7️⃣ Return DTO
        return convertToResponseDto(updated);
    }
    
    private String generateQuotationNo(Integer id) {
        String prefix = "REPAIR";
        String year = String.valueOf(LocalDate.now().getYear());
        return prefix + "-" + year + "-" + String.format("%03d", id);
    }



    // 🔹 CONVERT ENTITY → DTO
    private MaterialQuotationResponseDto convertToResponseDto(MaterialQuotation entity) {
        MaterialQuotationResponseDto dto = new MaterialQuotationResponseDto();

        dto.setModQuotId(entity.getModQuotId());
        dto.setQuatationNo(entity.getQuatationNo());
        dto.setQuatationDate(entity.getQuatationDate());
        dto.setNote(entity.getNote());
        dto.setGst(entity.getGst());
        dto.setWorkPeriod(entity.getWorkPeriodEntity().getName());
        dto.setIsFinal(entity.getIsFinal());
        dto.setQuotFinalDate(entity.getQuotFinalDate());

        dto.setJobNo(entity.getAmcJob() != null ? entity.getAmcJob().getJobNo() : null);
        dto.setCustomerName(entity.getAmcJob() != null ? entity.getAmcJob().getCustomer().getCustomerName(): null);
        dto.setSiteName(entity.getAmcJob() != null ? entity.getAmcJob().getSite().getSiteName(): null);


        dto.setRenewalJobNo(entity.getAmcRenewalJob() != null ? entity.getAmcRenewalJob().getJobNo() : null);

        if (entity.getDetails() != null) {
            dto.setDetails(entity.getDetails().stream().map(d -> {
                QuotationDetailResponseDto qd = new QuotationDetailResponseDto();
                qd.setModQuotDetailId(d.getModQuotDetailId());
                qd.setMaterialName(d.getMaterialName());
                qd.setHsn(d.getHsn());
                qd.setQuantity(d.getQuantity());
                qd.setRate(d.getRate());
                qd.setAmount(d.getAmount());
                qd.setGuarantee(d.getGuarantee());
                return qd;
            }).collect(Collectors.toList()));
        }

        return dto;
    }

    public ResponseEntity<MaterialQuotationRequestGetData> getMaterialQuotationRequestGetData() {
        // The existing business logic is correct:
        MaterialQuotationRequestGetData materialQuotationRequestGetData = 
                new MaterialQuotationRequestGetData();

        List<WorkPeriod> periods = workPeriodService.getAllWorkPeriods();

        // NOTE: This assumes companySettingRepository.findAll() returns at least one element.
        CompanySetting companySetting =	companySettingRepository.findAll().get(0);

        double gst = companySetting.getGstRateAmcTotalPercentage();

        String hsnCode = companySetting.getSacCodeMaterialRepairLabor();

        materialQuotationRequestGetData.setGst(gst);
        materialQuotationRequestGetData.setHsnCode(hsnCode);
        materialQuotationRequestGetData.setWorkPeriods(periods);

        // --- CORRECTION APPLIED HERE ---
        // 1. You need to pass the object (materialQuotationRequestGetData) to the .body() method.
        // 2. The type in ResponseEntity's constructor should not be present with .ok().
        return ResponseEntity.ok(materialQuotationRequestGetData); 
        // This is the common and most concise way to return a 200 OK status with a body.
        
        // An alternative correct way would be:
        // return new ResponseEntity<>(materialQuotationRequestGetData, HttpStatus.OK);
    }
    
}

