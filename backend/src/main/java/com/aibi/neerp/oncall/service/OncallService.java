package com.aibi.neerp.oncall.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aibi.neerp.amc.invoice.dto.AmcInvoiceRequestDto;
import com.aibi.neerp.amc.invoice.repository.AmcInvoiceRepository;
import com.aibi.neerp.amc.invoice.service.AmcInvoiceService;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.amc.materialrepair.entity.MaterialQuotation;
import com.aibi.neerp.amc.materialrepair.entity.WorkPeriod;
import com.aibi.neerp.amc.materialrepair.repository.WorkPeriodRepository;
import com.aibi.neerp.amc.quatation.pdf.dto.AmcQuotationPdfHeadingWithContentsDto;
import com.aibi.neerp.amc.quatation.pdf.dto.AmcQuotationPdfHeadingsContentsDto;
import com.aibi.neerp.amc.quatation.pdf.repository.AmcQuotationPdfHeadingsContentsRepository;
import com.aibi.neerp.amc.quatation.pdf.repository.AmcQuotationPdfHeadingsRepository;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.leadmanagement.repository.CombinedEnquiryRepository;
import com.aibi.neerp.leadmanagement.repository.EnquiryRepository;
import com.aibi.neerp.leadmanagement.repository.NewLeadsRepository;
import com.aibi.neerp.modernization.dto.MaterialDetails;
import com.aibi.neerp.oncall.dto.*;
import com.aibi.neerp.oncall.entity.*;
import com.aibi.neerp.oncall.repository.*;
import com.aibi.neerp.settings.entity.CompanySetting;
import com.aibi.neerp.settings.repository.CompanySettingRepository;
import com.aibi.neerp.settings.service.CompanySettingService;
import com.aibi.neerp.util.AmountToWordsService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OncallService {

    private final OnCallQuotationRepository onCallQuotationRepository;
    private final OnCallQuotationDetailRepository onCallQuotationDetailRepository;

    private final NewLeadsRepository newLeadsRepository;
    private final EnquiryRepository enquiryRepository;
    private final CombinedEnquiryRepository combinedEnquiryRepository;
    private final WorkPeriodRepository workPeriodRepository;
    private final CompanySettingService companySettingService;
    private final CompanySettingRepository companySettingRepository;
    private final AmcJobsService amcJobsService;
    private final AmcInvoiceRepository invoiceRepository;
    private final AmcInvoiceService amcInvoiceService;
    private final AmountToWordsService amountToWordsService;
    private final AmcQuotationPdfHeadingsRepository amcQuotationPdfHeadingsRepository;
    private final AmcQuotationPdfHeadingsContentsRepository amcQuotationPdfHeadingsContentsRepository;

    // --- CREATE OnCall Quotation with Details ---
    @Transactional
    public OncallResponseDto createOnCallQuotation(OncallRequestDto requestDto) {

        OncallDto dto = requestDto.getOncallDto();
        List<OncallDetailDto> detailDtos = requestDto.getOncallDetailDtos();

        OnCallQuotation quotation = new OnCallQuotation();
        quotation.setQuotationNo(dto.getQuotationNo());
        quotation.setQuotationDate(dto.getQuotationDate());
        quotation.setJobId(dto.getJobId());
        quotation.setNote(dto.getNote());
        quotation.setGst(dto.getGst());
        quotation.setWarranty(dto.getWarranty());
        quotation.setAmount(dto.getAmount());
        quotation.setAmountWithGst(dto.getAmountWithGst());
        quotation.setIsFinal(dto.getIsFinal());
        quotation.setQuotationFinalDate(dto.getQuotationFinalDate());
        quotation.setGstApplicable(dto.getGstApplicable());
        quotation.setGstPercentage(dto.getGstPercentage());
        quotation.setSubtotal(dto.getSubtotal());
        quotation.setGstAmount(dto.getGstAmount());

        if (dto.getLeadId() != null)
            quotation.setLead(newLeadsRepository.findById(dto.getLeadId()).orElse(null));
        if (dto.getEnquiryId() != null)
            quotation.setEnquiry(enquiryRepository.findById(dto.getEnquiryId()).orElse(null));
        if (dto.getCombinedEnquiryId() != null)
            quotation.setCombinedEnquiry(combinedEnquiryRepository.findById(dto.getCombinedEnquiryId()).orElse(null));
        if (dto.getWorkPeriodId() != null)
            quotation.setWorkPeriodEntity(workPeriodRepository.findById(dto.getWorkPeriodId()).orElse(null));

        OnCallQuotation savedQuotation = onCallQuotationRepository.save(quotation);

        if (detailDtos != null && !detailDtos.isEmpty()) {
            List<OnCallQuotationDetail> details = detailDtos.stream()
                    .map(d -> OnCallQuotationDetail.builder()
                            .onCallQuotation(savedQuotation)
                            .materialName(d.getMaterialName())
                            .hsn(d.getHsn())
                            .quantity(d.getQuantity())
                            .uom(d.getUom())
                            .rate(d.getRate())
                            .amount(d.getAmount())
                            .guarantee(d.getGuarantee())
                            .build())
                    .collect(Collectors.toList());
            onCallQuotationDetailRepository.saveAll(details);
        }

        return OncallResponseDto.builder()
                .oncallDto(dto)
                .details(detailDtos)
                .build();
    }

    // --- PRE DATA for creating OnCall Quotation ---
    public OncallRequestDtoPreData getOnCallQuotationPreData(Integer combinedEnquiryId) {

        OncallRequestDtoPreData preData = new OncallRequestDtoPreData();

        CompanySetting companySetting = companySettingService.getCompanySetting();
        String hsnSacCode = (companySetting != null) ? companySetting.getSacCodeModernization() : "";

        preData.setHsn_sac_code(hsnSacCode);

        Integer maxId = onCallQuotationRepository.findAll().stream()
                .map(OnCallQuotation::getId)
                .max(Integer::compareTo)
                .orElse(0);
        maxId++;

        preData.setQuotationNo("ONCALL-" + maxId);
        preData.setJobId("JOB-" + maxId);

        CombinedEnquiry combinedEnquiry = combinedEnquiryRepository.findById(combinedEnquiryId)
                .orElseThrow(() -> new EntityNotFoundException("Combined Enquiry not found with ID: " + combinedEnquiryId));

        List<LiftData> liftDatas = amcJobsService.buildLiftData(combinedEnquiry);
        preData.setLiftDatas(liftDatas);

        List<WorkPeriod> workPeriods = workPeriodRepository.findAll();
        preData.setWorkPeriods(workPeriods);

        return preData;
    }

    // --- GET ALL OnCall Quotations (search + sort + pagination) ---
    public Page<OncallResponseDto> getAllOnCallQuotations(
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

        Page<OnCallQuotation> results = onCallQuotationRepository.searchAll(
                search == null ? "" : search,
                dateSearchStr,
                pageable
        );

        return results.map(this::convertToResponseDto);
    }

    // --- Convert Entity to DTO ---
    private OncallResponseDto convertToResponseDto(OnCallQuotation entity) {

        OncallDto dto = OncallDto.builder()
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

        List<OncallDetailDto> details = (entity.getDetails() != null)
                ? entity.getDetails().stream()
                .map(d -> OncallDetailDto.builder()
                        .id(d.getId())
                        .materialName(d.getMaterialName())
                        .hsn(d.getHsn())
                        .quantity(d.getQuantity())
                        .uom(d.getUom())
                        .rate(d.getRate())
                        .amount(d.getAmount())
                        .guarantee(d.getGuarantee())
                        .build())
                .toList()
                : Collections.emptyList();

        return OncallResponseDto.builder()
                .oncallDto(dto)
                .details(details)
                .build();
    }

    // --- Get by ID ---
    public OncallResponseDto getOnCallQuotationById(Integer id) {
        OnCallQuotation quotation = onCallQuotationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OnCall quotation not found with ID: " + id));
        return convertToResponseDto(quotation);
    }

    // --- Update Final Status ---
    @Transactional
    public boolean updateIsFinalStatus(Integer id, Boolean isFinal) {
        Optional<OnCallQuotation> optional = onCallQuotationRepository.findById(id);
        if (optional.isPresent()) {
            OnCallQuotation quotation = optional.get();
            quotation.setIsFinal(isFinal);
            onCallQuotationRepository.save(quotation);
            
            createOncallInvoice(id);
            return true;
        }
        return false;
    }
    
    public void createOncallInvoice(Integer onCallQuotationId) {
    	
    	AmcInvoiceRequestDto amcInvoiceRequestDto = buildAmcInvoiceDto(onCallQuotationId);
        
    	amcInvoiceService.saveInvoice(amcInvoiceRequestDto);
    }
    
    public AmcInvoiceRequestDto buildAmcInvoiceDto(Integer onCallQuotationId) {
    	
    	AmcInvoiceRequestDto amcInvoiceRequestDto = 
    			new AmcInvoiceRequestDto();
    	
    	OnCallQuotation onCallQuotation = onCallQuotationRepository.findById(onCallQuotationId).get();
    	EnquiryType enquiryType = onCallQuotation.getCombinedEnquiry().getEnquiryType();
    	
    	amcInvoiceRequestDto.setTotalAmt(onCallQuotation.getAmountWithGst());
    	amcInvoiceRequestDto.setEnquiryType(enquiryType);
    	amcInvoiceRequestDto.setOnCallQuotation(onCallQuotation);
    	amcInvoiceRequestDto.setIsCleared(0);
    	
    	LocalDate invoiceDate = LocalDate.now();
    	
    	amcInvoiceRequestDto.setInvoiceDate(invoiceDate);
    	
    	Integer nextInvoiceId = invoiceRepository.findMaxInvoiceId() + 1;
        String currentYear = String.valueOf(Year.now().getValue());
        String formattedInvoiceNo = String.format("INV-%s-%04d", currentYear, nextInvoiceId);

       
        amcInvoiceRequestDto.setInvoiceNo(formattedInvoiceNo);
        
        return amcInvoiceRequestDto;

    }

 // --- Update OnCall Quotation ---
    @Transactional
    public OncallResponseDto updateOnCallQuotation(Integer id, OncallRequestDto requestDto) {

        OncallDto dto = requestDto.getOncallDto();
        List<OncallDetailDto> detailDtos = requestDto.getOncallDetailDtos();

        // 1. Fetch the existing entity by ID
        OnCallQuotation existing = onCallQuotationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OnCall Quotation not found with ID: " + id));

        // 2. Update fields from DTO to Entity
        existing.setQuotationNo(dto.getQuotationNo());
        existing.setQuotationDate(dto.getQuotationDate());
        existing.setJobId(dto.getJobId());
        existing.setNote(dto.getNote());
        existing.setGst(dto.getGst());
        existing.setWarranty(dto.getWarranty());
        existing.setAmount(dto.getAmount());
        existing.setAmountWithGst(dto.getAmountWithGst());
        existing.setGstApplicable(dto.getGstApplicable());
        existing.setGstPercentage(dto.getGstPercentage());
        existing.setSubtotal(dto.getSubtotal());
        existing.setGstAmount(dto.getGstAmount());

        // 3. Update Foreign Key references
        if (dto.getLeadId() != null)
            existing.setLead(newLeadsRepository.findById(dto.getLeadId()).orElse(null));
        if (dto.getEnquiryId() != null)
            existing.setEnquiry(enquiryRepository.findById(dto.getEnquiryId()).orElse(null));
        if (dto.getCombinedEnquiryId() != null)
            existing.setCombinedEnquiry(combinedEnquiryRepository.findById(dto.getCombinedEnquiryId()).orElse(null));
        if (dto.getWorkPeriodId() != null)
            existing.setWorkPeriodEntity(workPeriodRepository.findById(dto.getWorkPeriodId()).orElse(null));

        // 4. Save the updated parent entity
        OnCallQuotation saved = onCallQuotationRepository.save(existing);

        // --- 5. Update Details: Delete and Re-insert (Repaired Logic) ---
        
        // A. Delete all existing details linked to this quotation ID
        // Assuming you have this method in your detail repository, similar to Modernization:
        onCallQuotationDetailRepository.deleteByOnCallQuotationId(id); 

        // B. Prepare and save the new/updated details
        List<OnCallQuotationDetail> savedDetails = null;
        if (detailDtos != null && !detailDtos.isEmpty()) {
            savedDetails = detailDtos.stream()
                    .map(d -> OnCallQuotationDetail.builder()
                            .onCallQuotation(saved) // Link to the newly saved parent
                            .materialName(d.getMaterialName())
                            .hsn(d.getHsn())
                            .quantity(d.getQuantity())
                            .uom(d.getUom())
                            .rate(d.getRate())
                            .amount(d.getAmount())
                            .guarantee(d.getGuarantee())
                            .build())
                    .collect(Collectors.toList());
            onCallQuotationDetailRepository.saveAll(savedDetails);
        }
        
        // 6. Build response DTO
        return OncallResponseDto.builder()
                .oncallDto(dto)
                .details(detailDtos)
                .build();
    }
    // --- Build OnCall Quotation Invoice Data ---
    public OncallQuotationInvoiceData getOnCallQuotationInvoiceData(Integer onCallId) {

        OnCallQuotation quotation = onCallQuotationRepository.findById(onCallId)
                .orElseThrow(() -> new RuntimeException("OnCall Quotation not found with ID: " + onCallId));

        CompanySetting companySetting = companySettingRepository.findAll()
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Company settings not configured"));

        NewLeads lead = quotation.getLead();
        if (lead == null) throw new RuntimeException("Lead not found for OnCall ID: " + onCallId);

        BigDecimal subTotal = quotation.getSubtotal() != null ? quotation.getSubtotal() : BigDecimal.ZERO;
        BigDecimal gstPercentage = quotation.getGstPercentage() != null ? quotation.getGstPercentage() : BigDecimal.ZERO;
        BigDecimal gstHalf = gstPercentage.divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);

        BigDecimal CGST_Amount = calculateTaxAmount(subTotal, gstHalf);
        BigDecimal SGST_Amount = calculateTaxAmount(subTotal, gstHalf);

        BigDecimal totalWithTax = subTotal.add(CGST_Amount).add(SGST_Amount);
        Map<String, BigDecimal> roundData = calculateRoundOff(totalWithTax);

        BigDecimal roundedGrandTotal = roundData.get("roundedTotal");
        BigDecimal roundOffValue = roundData.get("roundOffValue");

        //String amountInWords = convertAmountToWords(roundedGrandTotal);
        
        String amountInWords = amountToWordsService.convertAmountToWords(roundedGrandTotal);


        return OncallQuotationInvoiceData.builder()
                .companyName(companySetting.getCompanyName())
                .officeAddress(companySetting.getOfficeAddressLine1())
                .GSTIN_UIN(companySetting.getCompanyGst())
                .contactNo(companySetting.getOfficeNumber())
                .email(companySetting.getCompanyMail())
                .invoiceNo(quotation.getQuotationNo())
                .dated(quotation.getQuotationDate())
                .purchaseOrderNo("")
                .purchaseOrderNoDated(null)
                .deliveryChallanNo("")
                .deliveryChallanNoDated(null)
                .buyerAddress(lead.getAddress())
                .gstin("")
                .buyerContactNo(lead.getContactNo())
                .siteName(lead.getSiteName())
                .siteAddress(lead.getSiteAddress())
                .materialDetails(
                        quotation.getDetails().stream()
                                .map(detail -> OncallQuotationInvoiceData.MaterialDetails.builder()
                                        .particulars(detail.getMaterialName())
                                        .hsnSac(detail.getHsn())
                                        .quantity(detail.getQuantity())
                                        .rate(detail.getRate())
                                        .per("Nos")
                                        .amount(detail.getAmount())
                                        .build())
                                .toList()
                )
                .subTotal(subTotal)
                .cgstStr("CGST " + gstHalf + "%")
                .sgstStr("SGST " + gstHalf + "%")
                .cgstAmount(CGST_Amount)
                .sgstAmount(SGST_Amount)
                .roundOffValue(roundOffValue)
                .grandTotal(roundedGrandTotal)
                .amountChargeableInWords(amountInWords)
                .name(companySetting.getBankName())
                .accountNumber(companySetting.getAccountNumber())
                .branch(companySetting.getBranchName())
                .ifscCode(companySetting.getIfscCode())
                .forCompany(companySetting.getCompanyName())
                .build();
    }

    // --- Helpers ---
    private BigDecimal calculateTaxAmount(BigDecimal base, BigDecimal percent) {
        return base.multiply(percent).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    private Map<String, BigDecimal> calculateRoundOff(BigDecimal total) {
        BigDecimal rounded = total.setScale(0, RoundingMode.HALF_UP);
        BigDecimal roundOff = rounded.subtract(total).setScale(2, RoundingMode.HALF_UP);
        Map<String, BigDecimal> result = new HashMap<>();
        result.put("roundedTotal", rounded);
        result.put("roundOffValue", roundOff);
        return result;
    }

    private String convertAmountToWords(BigDecimal amount) {
        if (amount == null) return "";
        long rupees = amount.longValue();
        return rupees + " Rupees Only";
    }
    
    
    
    
    
    public List<JobDropdownForAddPayment> getDropdownForAddPayments() {

        // Fetch all finalized OnCall Quotations
        List<OnCallQuotation> oncallQuotations = onCallQuotationRepository.findAll()
            .stream()
            .filter(OnCallQuotation::getIsFinal)
            .collect(Collectors.toList());

        // Map each OnCallQuotation to JobDropdownForAddPayment DTO
        return oncallQuotations.stream().map(q -> {
            JobDropdownForAddPayment dto = new JobDropdownForAddPayment();

            // Set OnCall Quotation ID
            dto.setOncallQid(q.getId());
            dto.setCustomerName(q.getLead().getCustomerName());
            dto.setSiteName(q.getLead().getSiteName());
            dto.setMailId(q.getLead().getEmailId());
            
            return dto;
            
        }).collect(Collectors.toList());
    }

    
    
    public OncallQuotationPdfData getOncallQuotationPdfData(Integer id) {

        OnCallQuotation oncall = onCallQuotationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oncall quotation not found"));

        OncallQuotationPdfData dto = new OncallQuotationPdfData();

        // ==============================
        // BASIC INFO
        // ==============================
        LocalDate quotationDate = oncall.getQuotationDate();
        dto.setQuotationDate(quotationDate);

        String year = String.valueOf(quotationDate.getYear());
        String month = String.format("%02d", quotationDate.getMonthValue());
        String refId = String.format("%04d", oncall.getId());

        dto.setRefNo("ONC/" + year + "/" + month + "/" + refId);

        // ==============================
        // CUSTOMER + SITE
        // ==============================
        NewLeads lead = oncall.getLead();

        dto.setSitename(lead.getSiteName());
        dto.setSiteAddress(lead.getSiteAddress());
        dto.setCustomerName(lead.getCustomerName());
        dto.setCustomerNumber(lead.getContactNo());
        dto.setCustomerAddress(lead.getAddress());
        
        dto.setWorkperiod(oncall.getWorkPeriodEntity().getName());
        dto.setNote(oncall.getNote());
        dto.setWarranty(oncall.getWarranty()+"");
        
        dto.setKindAttention("Mr. " + lead.getCustomerName() + " (" + lead.getContactNo() + ")");
        dto.setSubject("Quotation for Lift Oncall Service.");

        // ==============================
        // COMPANY
        // ==============================
        String companyName = companySettingRepository.findAll().get(0).getCompanyName();
        dto.setCompanyName(companyName);

        // ==============================
        // AMOUNT IN WORDS
        // ==============================
        dto.setAmountInWords(amountToWordsService.convertAmountToWords(
                oncall.getAmountWithGst() != null ? oncall.getAmountWithGst() : BigDecimal.ZERO
        ));

        // ==============================
        // PRICING
        // ==============================
        OncallQuotationPdfPrizingData pricing = new OncallQuotationPdfPrizingData();

        List<MaterialDetails> materialDetails = oncall.getDetails()
                .stream()
                .map(d -> MaterialDetails.builder()
                        .particulars(d.getMaterialName())
                        .hsnSac(d.getHsn())
                        .quantity(d.getQuantity())
                        .guarantee(d.getGuarantee())
                        .rate(d.getRate())
                        .per(d.getUom())
                        .amount(d.getAmount())
                        .build())
                .toList();

        pricing.setMaterialDetails(materialDetails);
        pricing.setSubTotal(oncall.getSubtotal());
        pricing.setGstPercentage(
                oncall.getGstPercentage() != null ? oncall.getGstPercentage().doubleValue() : 0.0
        );
        pricing.setAmountWithGst(oncall.getAmountWithGst());
        pricing.setGrandTotal(oncall.getAmountWithGst());

        dto.setOncallQuotationPdfPrizingData(pricing);

        // ==============================
        // HEADINGS + CONTENTS (for Oncall)
        // ==============================
        List<AmcQuotationPdfHeadingWithContentsDto> headingDtos =
                amcQuotationPdfHeadingsRepository.findAll()
                        .stream()
                        .filter(h -> h.getQuotationType().equalsIgnoreCase("Oncall") ||
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

        dto.setOncallQuotationPdfHeadingWithContentsDtos(headingDtos);

        return dto;
    }

    
    
    
    
    
    
}
