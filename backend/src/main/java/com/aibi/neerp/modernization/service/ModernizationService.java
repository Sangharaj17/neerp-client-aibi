package com.aibi.neerp.modernization.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;


import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import com.aibi.neerp.modernization.dto.*;
import com.aibi.neerp.modernization.entity.*;
import com.aibi.neerp.modernization.repository.*;
import com.aibi.neerp.oncall.entity.OnCallQuotation;
import com.aibi.neerp.settings.entity.CompanySetting;
import com.aibi.neerp.settings.repository.CompanySettingRepository;
import com.aibi.neerp.settings.service.CompanySettingService;
import com.aibi.neerp.util.AmountToWordsService;

import jakarta.persistence.EntityNotFoundException;

import com.aibi.neerp.amc.invoice.dto.AmcInvoiceRequestDto;
import com.aibi.neerp.amc.invoice.repository.AmcInvoiceRepository;
import com.aibi.neerp.amc.invoice.service.AmcInvoiceService;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;
import com.aibi.neerp.amc.materialrepair.entity.WorkPeriod;
import com.aibi.neerp.amc.materialrepair.repository.WorkPeriodRepository;
import com.aibi.neerp.amc.quatation.pdf.dto.AmcQuotationPdfHeadingWithContentsDto;
import com.aibi.neerp.amc.quatation.pdf.dto.AmcQuotationPdfHeadingsContentsDto;
import com.aibi.neerp.amc.quatation.pdf.entity.AmcQuotationPdfHeadings;
import com.aibi.neerp.amc.quatation.pdf.repository.AmcQuotationPdfHeadingsContentsRepository;
import com.aibi.neerp.amc.quatation.pdf.repository.AmcQuotationPdfHeadingsRepository;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
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
    private final CompanySettingRepository companySettingRepository;
    private final AmcJobsService amcJobsService;
    
    private final AmcInvoiceRepository invoiceRepository;
    
    private final AmcInvoiceService amcInvoiceService;
    
    private final AmcQuotationPdfHeadingsRepository amcQuotationPdfHeadingsRepository;
    private final AmcQuotationPdfHeadingsContentsRepository amcQuotationPdfHeadingsContentsRepository;
    
    private final AmountToWordsService amountToWordsService;
    

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
            modernizationRequestDtoPreData.setQuotationNo("MOD-" + maxId);
            modernizationRequestDtoPreData.setJobId("JOB-" + maxId);
        } else {
            // Handle case where maxId might be null (e.g., first record)
            modernizationRequestDtoPreData.setQuotationNo("MOD-1");
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
            
            createModernizationInvoice(id);
            
            return true;
        }
        return false;
    }
    
    public void createModernizationInvoice(Integer modernizationQuotationId) {
    	
    	AmcInvoiceRequestDto amcInvoiceRequestDto = buildAmcInvoiceDto(modernizationQuotationId);
        
    	amcInvoiceService.saveInvoice(amcInvoiceRequestDto);
    }
    
    public AmcInvoiceRequestDto buildAmcInvoiceDto(Integer modernizationQuotationId) {
    	
    	AmcInvoiceRequestDto amcInvoiceRequestDto = 
    			new AmcInvoiceRequestDto();
    	
    	Modernization modernization = modernizationRepository.findById(modernizationQuotationId).get();
    	EnquiryType enquiryType = modernization.getCombinedEnquiry().getEnquiryType();
    	
    	amcInvoiceRequestDto.setTotalAmt(modernization.getAmountWithGst());
    	amcInvoiceRequestDto.setEnquiryType(enquiryType);
    	amcInvoiceRequestDto.setModernization(modernization);
    	amcInvoiceRequestDto.setIsCleared(0);
    	
    	LocalDate invoiceDate = LocalDate.now();
    	
    	amcInvoiceRequestDto.setInvoiceDate(invoiceDate);
    	
    	Integer nextInvoiceId = invoiceRepository.findMaxInvoiceId() + 1;
        String currentYear = String.valueOf(Year.now().getValue());
        String formattedInvoiceNo = String.format("INV-%s-%04d", currentYear, nextInvoiceId);

       
        amcInvoiceRequestDto.setInvoiceNo(formattedInvoiceNo);
        
        return amcInvoiceRequestDto;

    }

    
    
    
    // --- UPDATE Modernization with Details ---
    @Transactional
    public ModernizationResponseDto updateModernization(Integer id, ModernizationRequestDto requestDto) {

        ModernizationDto dto = requestDto.getModernization();
        List<ModernizationDetailDto> detailDtos = requestDto.getDetails();

        // 1. Fetch the existing entity by ID
        Modernization existingModernization = modernizationRepository.findById(id).get();
            
        // 2. Update fields from DTO to Entity (No 'isFinal' or 'quotationFinalDate')
        existingModernization.setQuotationNo(dto.getQuotationNo());
        existingModernization.setQuotationDate(dto.getQuotationDate());
        existingModernization.setJobId(dto.getJobId());
        existingModernization.setNote(dto.getNote());
        existingModernization.setGst(dto.getGst());
        existingModernization.setWarranty(dto.getWarranty());
        existingModernization.setAmount(dto.getAmount());
        existingModernization.setAmountWithGst(dto.getAmountWithGst());
        
        // --- REMOVED FIELDS: isFinal and quotationFinalDate are NOT set ---
        // existingModernization.setIsFinal(dto.getIsFinal());
        // existingModernization.setQuotationFinalDate(dto.getQuotationFinalDate());
        
        existingModernization.setGstApplicable(dto.getGstApplicable());
        existingModernization.setGstPercentage(dto.getGstPercentage());
        existingModernization.setSubtotal(dto.getSubtotal());
        existingModernization.setGstAmount(dto.getGstAmount());


        // 3. Update Foreign Key references (similar to create)
        // Note: For updates, you may only want to update keys that are intended to change, 
        // but this mirrors your existing create logic.
        if (dto.getLeadId() != null)
            existingModernization.setLead(newLeadsRepository.findById(dto.getLeadId()).orElse(null));

        if (dto.getEnquiryId() != null)
            existingModernization.setEnquiry(enquiryRepository.findById(dto.getEnquiryId()).orElse(null));

        if (dto.getCombinedEnquiryId() != null)
            existingModernization.setCombinedEnquiry(combinedEnquiryRepository.findById(dto.getCombinedEnquiryId()).orElse(null));

        if (dto.getWorkPeriodId() != null)
            existingModernization.setWorkPeriodEntity(workPeriodRepository.findById(dto.getWorkPeriodId()).orElse(null));


        // 4. Save the updated parent entity
        Modernization savedModernization = modernizationRepository.save(existingModernization);


        // 5. Update Details: Delete and Re-insert (Atomic Transaction)
        
        // A. Delete all existing details linked to this quotation ID
        modernizationDetailRepository.deleteByModernizationId(id); // Assuming you have this method in your detail repository

        // B. Prepare and save the new/updated details
        List<ModernizationDetail> savedDetails = null;
        if (detailDtos != null && !detailDtos.isEmpty()) {
            savedDetails = detailDtos.stream()
                    .map(d -> ModernizationDetail.builder()
                            // Link to the newly saved parent
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

        // 6. Build response DTO
        ModernizationResponseDto response = ModernizationResponseDto.builder()
                .modernization(dto)
                .details(detailDtos)
                .build();

        return response;
    }
    
    

    public ModernizationQuotationInvoiceData getModernizationQuotationInvoiceData(Integer modernizationId) {

        // --- Fetch Modernization Quotation ---
        Modernization modernization = modernizationRepository.findById(modernizationId)
                .orElseThrow(() -> new RuntimeException("Modernization Quotation not found with ID: " + modernizationId));

        // --- Fetch Company Settings ---
        CompanySetting companySetting = companySettingRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Company settings not configured"));

        // --- Get Customer / Site info from NewLeads ---
        NewLeads lead = modernization.getLead();
        if (lead == null) {
            throw new RuntimeException("Lead not found for Modernization ID: " + modernizationId);
        }
        

        // --- GST Calculations ---
        BigDecimal subTotal = modernization.getSubtotal() != null ? modernization.getSubtotal() : BigDecimal.ZERO;
        BigDecimal gstPercentage = modernization.getGstPercentage() != null ? modernization.getGstPercentage() : BigDecimal.ZERO;
        BigDecimal gstHalf = gstPercentage.divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);

        BigDecimal CGST_Amount = calculateTaxAmount(subTotal, gstHalf);
        BigDecimal SGST_Amount = calculateTaxAmount(subTotal, gstHalf);

        BigDecimal totalWithTax = subTotal.add(CGST_Amount).add(SGST_Amount);
        Map<String, BigDecimal> roundData = calculateRoundOff(totalWithTax);

        BigDecimal roundedGrandTotal = roundData.get("roundedTotal");
        BigDecimal roundOffValue = roundData.get("roundOffValue");

        // --- Amount in Words ---
        String amountInWords = amountToWordsService.convertAmountToWords(roundedGrandTotal);

        
        // --- Build DTO ---
        return ModernizationQuotationInvoiceData.builder()
                .companyName(companySetting.getCompanyName())
                .officeAddress(companySetting.getOfficeAddressLine1())
                .GSTIN_UIN(companySetting.getCompanyGst())
                .contactNo(companySetting.getOfficeNumber())
                .email(companySetting.getCompanyMail())

                .invoiceNo(modernization.getQuotationNo())
                .dated(modernization.getQuotationDate())
                .purchaseOrderNo("")
                .purchaseOrderNoDated(null)
                .deliveryChallanNo("")
                .deliveryChallanNoDated(null)

                // --- Buyer / Site info ---
                .buyerAddress(lead.getAddress())
                .gstin("")
                .buyerContactNo(lead.getContactNo())
                .siteName(lead.getSiteName())
                .siteAddress(lead.getSiteAddress())

                // --- Material Details (using your style) ---
                .materialDetails(
                        modernization.getDetails().stream()
                                .map(detail -> ModernizationQuotationInvoiceData.MaterialDetails.builder()
                                        .particulars(detail.getMaterialName())
                                        .hsnSac(detail.getHsn())
                                        .quantity(detail.getQuantity())
                                        .rate(detail.getRate())
                                        .per("Nos") // adjust if needed based on your DB field
                                        .amount(detail.getAmount())
                                        .build()
                                )
                                .toList()
                )

                // --- Totals ---
                .subTotal(subTotal)
                .cgstStr("CGST " + gstHalf + "%")
                .sgstStr("SGST " + gstHalf + "%")
                .cgstAmount(CGST_Amount)
                .sgstAmount(SGST_Amount)
                .roundOffValue(roundOffValue)
                .grandTotal(roundedGrandTotal)
                .amountChargeableInWords(amountInWords)

                // --- Bank details ---
                .name(companySetting.getBankName())
                .accountNumber(companySetting.getAccountNumber())
                .branch(companySetting.getBranchName())
                .ifscCode(companySetting.getIfscCode())
                .forCompany(companySetting.getCompanyName())

                .build();
    }

    // --- Helper: Tax calculation ---
    private BigDecimal calculateTaxAmount(BigDecimal base, BigDecimal percent) {
        return base.multiply(percent).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    // --- Helper: Round off ---
    private Map<String, BigDecimal> calculateRoundOff(BigDecimal total) {
        BigDecimal rounded = total.setScale(0, RoundingMode.HALF_UP);
        BigDecimal roundOff = rounded.subtract(total).setScale(2, RoundingMode.HALF_UP);

        Map<String, BigDecimal> result = new HashMap<>();
        result.put("roundedTotal", rounded);
        result.put("roundOffValue", roundOff);
        return result;
    }

    // --- Helper: Convert number to words ---
    private String convertAmountToWords(BigDecimal amount) {
        if (amount == null) return "";
        long rupees = amount.longValue();
        return rupees + " Rupees Only"; // simple version; you can enhance later
    }
    
    
    public List<JobDropdownForAddPayment> getDropdownForAddPayments() {

        // Fetch all finalized Modernization quotations
        List<Modernization> modernizationQuotations = modernizationRepository.findAll()
            .stream()
            .filter(Modernization::getIsFinal)
            .collect(Collectors.toList());

        // Map each Modernization quotation to JobDropdownForAddPayment DTO
        return modernizationQuotations.stream().map(q -> {
            JobDropdownForAddPayment dto = new JobDropdownForAddPayment();

            // Set Modernization Quotation ID
            dto.setModernizationQid(q.getId());

            // Extract lead info (with null safety)
            if (q.getLead() != null) {
                dto.setCustomerName(q.getLead().getCustomerName());
                dto.setSiteName(q.getLead().getSiteName());
                dto.setMailId(q.getLead().getEmailId());
            } else {
                dto.setCustomerName("");
                dto.setSiteName("");
                dto.setMailId("");
            }

            return dto;
        }).collect(Collectors.toList());
    }


    public ModernizatationQuotationPdfData getModernizatationQuotationPdfData(Integer id) {

        Modernization modernization = modernizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Modernization quotation not found"));

        ModernizatationQuotationPdfData dto = new ModernizatationQuotationPdfData();

        // ==============================
        // BASIC INFO
        // ==============================
        LocalDate quotationDate = modernization.getQuotationDate();
        dto.setQuotationDate(quotationDate);

        String year = String.valueOf(quotationDate.getYear());
        String month = String.format("%02d", quotationDate.getMonthValue());
        String refId = String.format("%04d", modernization.getId());

        dto.setRefNo("MOD/" + year + "/" + month + "/" + refId);

        // ==============================
        // CUSTOMER + SITE
        // ==============================
        NewLeads lead = modernization.getLead();

        dto.setSitename(lead.getSiteName());
        dto.setSiteAddress(lead.getSiteAddress());
        dto.setCustomerName(lead.getCustomerName());
        dto.setCustomerNumber(lead.getContactNo());
        dto.setCustomerAddress(lead.getAddress());

        dto.setKindAttention("Mr. " + lead.getCustomerName() + " (" + lead.getContactNo() + ")");
        dto.setSubject("Quotation for Lift Modernization.");
        
        dto.setWorkperiod(modernization.getWorkPeriodEntity().getName());
        dto.setNote(modernization.getNote());
        dto.setWarranty(modernization.getWarranty()+"");

        // ==============================
        // COMPANY
        // ==============================
        String companyName = companySettingRepository.findAll().get(0).getCompanyName();
        dto.setCompanyName(companyName);

        // ==============================
        // AMOUNT IN WORDS
        // ==============================
        dto.setAmountInWords(amountToWordsService.convertAmountToWords(
                modernization.getAmountWithGst() != null ? modernization.getAmountWithGst() : BigDecimal.ZERO
        ));

        // ==============================
        // PRICING
        // ==============================
        ModernizationQuotationPdfPrizingData pricing = new ModernizationQuotationPdfPrizingData();

        // 🔥 Correct mapping according to your entity ModernizationDetail
        List<MaterialDetails> materialDetails = modernization.getDetails()
                .stream()
                .map(d -> MaterialDetails.builder()
                        .particulars(d.getMaterialName())  // FIXED
                        .hsnSac(d.getHsn())                // FIXED
                        .quantity(d.getQuantity())
                        .guarantee(d.getGuarantee())
                        .rate(d.getRate())
                        .per(d.getUom())                   // FIXED
                        .amount(d.getAmount())
                        .build())
                .toList();

        pricing.setMaterialDetails(materialDetails);
        pricing.setSubTotal(modernization.getSubtotal());
        pricing.setGstPercentage(
                modernization.getGstPercentage() != null ? modernization.getGstPercentage().doubleValue() : 0.0
        );
        pricing.setAmountWithGst(modernization.getAmountWithGst());
        pricing.setGrandTotal(modernization.getAmountWithGst());

        dto.setModernizationQuotationPdfPrizingData(pricing);

        // ==============================
        // HEADINGS + CONTENTS (for Modernization)
        // ==============================
        List<AmcQuotationPdfHeadingWithContentsDto> headingDtos =
                amcQuotationPdfHeadingsRepository.findAll()
                        .stream()
                        .filter(h -> h.getQuotationType().equalsIgnoreCase("Modernization") || 
                        		h.getQuotationType().equalsIgnoreCase("Common"))
                        .map(h -> {

                            AmcQuotationPdfHeadingWithContentsDto headingDto =
                                    new AmcQuotationPdfHeadingWithContentsDto();

                            headingDto.setId(h.getId());
                            headingDto.setHeadingName(h.getHeadingName());

                            List<AmcQuotationPdfHeadingsContentsDto> contents =
                                    amcQuotationPdfHeadingsContentsRepository.findAll()
                                            .stream()
                                            .filter(c -> c.getAmcQuotationPdfHeadings().getId().equals(h.getId()))
                                            .map(c -> new AmcQuotationPdfHeadingsContentsDto(
                                                    c.getId(),
                                                    c.getContentData(),
                                                    c.getPicture(),
                                                    h.getId()
                                            ))
                                            .toList();

                            headingDto.setContents(contents);
                            return headingDto;
                        })
                        .toList();

        dto.setModernizationQuotationPdfHeadingWithContentsDtos(headingDtos);

        return dto;
    }



    
    
    
}
