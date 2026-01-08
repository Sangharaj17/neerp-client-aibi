package com.aibi.neerp.amc.invoice.service;

import com.aibi.neerp.amc.invoice.dto.AmcInvoiceCountsDto;
import com.aibi.neerp.amc.invoice.dto.AmcInvoicePdfData;
import com.aibi.neerp.amc.invoice.dto.AmcInvoiceRequestDto;
import com.aibi.neerp.amc.invoice.dto.AmcInvoiceResponseDto;
import com.aibi.neerp.amc.invoice.entity.AmcInvoice;

import com.aibi.neerp.amc.invoice.repository.AmcInvoiceRepository;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobRepository;
// NOTE: You must also inject AmcJobRepository and AmcRenewalJobRepository 
// Example: import com.aibi.neerp.amc.jobs.repository.AmcJobRepository;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobRepository;
import com.aibi.neerp.amc.materialrepair.entity.MaterialQuotation;
import com.aibi.neerp.amc.materialrepair.repository.MaterialQuotationRepository;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.leadmanagement.repository.EnquiryTypeRepository;
import com.aibi.neerp.modernization.entity.Modernization;
import com.aibi.neerp.modernization.repository.ModernizationRepository;
import com.aibi.neerp.oncall.entity.OnCallQuotation;
import com.aibi.neerp.oncall.repository.OnCallQuotationRepository;
import com.aibi.neerp.settings.entity.CompanySetting;
import com.aibi.neerp.settings.repository.CompanySettingRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.temporal.ChronoField;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AmcInvoiceService {

    private final AmcInvoiceRepository invoiceRepository;
    private final AmcJobRepository amcJobRepository;
    private final AmcRenewalJobRepository amcRenewalJobRepository;
    private final CompanySettingRepository companySettingRepository;
    private final EnquiryTypeRepository enquiryTypeRepository;
    
    private final MaterialQuotationRepository materialQuotationRepository;
    private final OnCallQuotationRepository onCallQuotationRepository;
    private final ModernizationRepository modernizationRepository;
    
    // NOTE: In a real app, you would inject the repositories needed to fetch the FK entities.
    // private final AmcJobRepository amcJobRepository; 

    // Mock/Placeholder for fetching FK entities (Replace with actual repository calls)
    private AmcJob fetchAmcJob(Integer jobId) {
        if (jobId == null) {
            return null;
        }
        return amcJobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("AMC Job not found with id: " + jobId));
    }

    private AmcRenewalJob fetchAmcRenewalJob(Integer renewalJobId) {
        if (renewalJobId == null) {
            return null;
        }
        return amcRenewalJobRepository.findById(renewalJobId)
                .orElseThrow(() -> new RuntimeException("AMC Renewal Job not found with id: " + renewalJobId));
    }

    
    // =================================================================
    // MAPPING LOGIC (Integrated)
    // =================================================================

    /** Converts Request DTO and FK IDs into a new AmcInvoice Entity. */
    private AmcInvoice toEntity(AmcInvoiceRequestDto dto) {
        AmcJob amcJob = fetchAmcJob(dto.getJobNo());
        AmcRenewalJob amcRenewalJob = fetchAmcRenewalJob(dto.getRenewlJobId());
        
        System.out.println("called toenityt ");
        
       EnquiryType enquiryType = dto.getEnquiryType();
   
       MaterialQuotation materialQuotation = dto.getMaterialQuotation();
       OnCallQuotation onCallQuotation = dto.getOnCallQuotation();
       Modernization modernization = dto.getModernization();

       
        return AmcInvoice.builder()
                .invoiceNo(dto.getInvoiceNo())
                .invoiceDate(dto.getInvoiceDate())
                .descOfService(dto.getDescOfService())
                .enquiryType(enquiryType)
                .sacCode(dto.getSacCode())
                .baseAmt(dto.getBaseAmt())
                .cgstAmt(dto.getCgstAmt())
                .sgstAmt(dto.getSgstAmt())
                .totalAmt(dto.getTotalAmt())
                .payFor(dto.getPayFor())
                .isCleared(dto.getIsCleared())
                .amcJob(amcJob)
                .amcRenewalJob(amcRenewalJob)
                .materialQuotation(materialQuotation)
                .onCallQuotation(onCallQuotation)
                .modernization(modernization)
                .build();
    }

    /** Converts an AmcInvoice Entity to an AmcInvoiceResponseDto. */
    private AmcInvoiceResponseDto toResponseDto(AmcInvoice entity) {
        AmcInvoiceResponseDto dto = new AmcInvoiceResponseDto();
        dto.setInvoiceId(entity.getInvoiceId());
        dto.setInvoiceNo(entity.getInvoiceNo());
        dto.setInvoiceDate(entity.getInvoiceDate());
        dto.setDescOfService(entity.getDescOfService());
        dto.setSacCode(entity.getSacCode());
        dto.setBaseAmt(entity.getBaseAmt());
        dto.setCgstAmt(entity.getCgstAmt());
        dto.setSgstAmt(entity.getSgstAmt());
        dto.setTotalAmt(entity.getTotalAmt());
        dto.setInvoiceFor(entity.getEnquiryType() != null ? entity.getEnquiryType().getEnquiryTypeName() : null);

        dto.setIsCleared(entity.getIsCleared());
        
        // Extract FK IDs from Entity objects
        dto.setJobNo(Optional.ofNullable(entity.getAmcJob()).map(AmcJob::getJobId).orElse(null));
        dto.setRenewlJobId(Optional.ofNullable(entity.getAmcRenewalJob()).map(AmcRenewalJob::getRenewalJobId).orElse(null));
        
        MaterialQuotation materialQuotation = entity.getMaterialQuotation();
        OnCallQuotation onCallQuotation = entity.getOnCallQuotation();
        Modernization modernization = entity.getModernization();
        
        if(materialQuotation!=null) {
        	dto.setMaterialRepairQuotationId(materialQuotation.getModQuotId());;
        }
        if(onCallQuotation!=null) {
        	dto.setOncallQuotationId(onCallQuotation.getId());
        	
        }
        if(modernization!=null) {
        	dto.setModernizationId(modernization.getId());
        }
        
      
        String siteName = "";
        String siteAddress  = "";
        
        if(entity.getAmcJob()!=null) {
        	
        	AmcJob amcJob = entity.getAmcJob();
        	siteName = amcJob.getSite().getSiteName();
        	siteAddress = amcJob.getSite().getSiteAddress();
        	
        }else if(entity.getAmcRenewalJob()!=null){
        	
        	AmcRenewalJob amcRenewalJob = entity.getAmcRenewalJob();
        	siteName = amcRenewalJob.getSite().getSiteName();
        	siteAddress = amcRenewalJob.getSite().getSiteAddress();
        }
        else {
        	
        	NewLeads lead = null;
        	
        	if(entity.getMaterialQuotation()!=null) {
        		
        		AmcJob amcJob = entity.getMaterialQuotation().getAmcJob();
        		AmcRenewalJob amcRenewalJob = entity.getMaterialQuotation().getAmcRenewalJob();
        		
        		if(amcJob!=null)
        			lead = amcJob.getLead();
        		else 
        			lead = amcRenewalJob.getLead();			
        	
        	}else if(entity.getOnCallQuotation()!=null) {
        		
        		lead = entity.getOnCallQuotation().getLead();
        		
        	}else {
        		
        		lead = entity.getModernization().getLead();
        	}
        	
        	siteName = lead.getSiteName();
        	siteAddress = lead.getSiteAddress();
        
        }

        
        dto.setSiteName(siteName);
        dto.setSiteAddress(siteAddress);

        return dto;
    }

    // =================================================================
    // CORRECTED CRUD OPERATIONS (Using DTOs)
    // =================================================================

 // This replaces your original public List<AmcInvoiceResponseDto> getAllInvoices()
    public Page<AmcInvoiceResponseDto> getInvoicesPaged(
            String search, 
            LocalDate date, 
            int page, 
            int size, 
            String sortBy, 
            String direction) {
        
        log.info("Fetching AMC Invoices (Pending/Current-Next Month) with search='{}', date='{}', page={}, size={}, sortBy={}, direction={}", 
                 search, date, page, size, sortBy, direction);

        // 1. Build Sort and Pageable
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // 2. Prepare search parameters (pass null if empty/blank for efficient query)
        String finalSearch = (search == null || search.trim().isEmpty()) ? null : search; 

        // 3. CRITICAL: Calculate Current and Next Month for the new query filter
        LocalDate today = LocalDate.now();
        int currentMonth = today.get(ChronoField.MONTH_OF_YEAR); 
        int nextMonth = today.plusMonths(1).get(ChronoField.MONTH_OF_YEAR); 
        
     // Convert LocalDate to String for repository query
        String dateSearch = date != null ? date.toString() : null;


        // 4. Execute the complex search query with the new month filters
        // The repository method MUST now accept currentMonth and nextMonth
        Page<AmcInvoice> results = invoiceRepository.searchAllInvoices(
                finalSearch == null ? "" : finalSearch,
                dateSearch, 
                currentMonth, // NEW parameter
                nextMonth,    // NEW parameter
                pageable
        );

        System.out.println("found results");
        // 5. Convert the Page of Entities to a Page of DTOs
        return results.map(this::toResponseDto);
    }

    public Page<AmcInvoiceResponseDto> getPendingInvoicesPaged(
            String search, 
            LocalDate date, 
            int page, 
            int size, 
            String sortBy, 
            String direction) {
        
        log.info("Fetching Pending AMC Invoices with search='{}', date='{}', page={}, size={}, sortBy={}, direction={}", 
                 search, date, page, size, sortBy, direction);

        // 1. Build Sort and Pageable
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // 2. Prepare search parameters
        String finalSearch = (search == null || search.trim().isEmpty()) ? null : search; 

        // 3. Calculate Current and Next Month
        LocalDate today = LocalDate.now();
        int currentMonth = today.get(ChronoField.MONTH_OF_YEAR); 
        int nextMonth = today.plusMonths(1).get(ChronoField.MONTH_OF_YEAR); 
        
        String dateSearch = date != null ? date.toString() : null;

        // 4. Execute the query
        Page<AmcInvoice> results = invoiceRepository.findAllPendingInvoices(
                finalSearch == null ? "" : finalSearch,
                dateSearch, 
                currentMonth, 
                nextMonth,   
                pageable
        );

        // 5. Convert to DTOs
        return results.map(this::toResponseDto);
    }

    // 2. Get Invoice by ID
    public AmcInvoiceResponseDto getInvoiceById(Integer id) {
        log.info("Service Call: Fetching invoice with ID: {}", id);
        return invoiceRepository.findById(id)
                .map(this::toResponseDto)
                .orElseThrow(() -> {
                    log.error("Service Error: Invoice not found with ID: {}", id);
                    return new RuntimeException("Invoice not found with id " + id);
                });
    }

    // 3. Create/Save an Invoice
    public AmcInvoiceResponseDto saveInvoice(AmcInvoiceRequestDto dto) {
        log.info("Service Call: Saving new invoice.");
        
        AmcInvoice invoice = toEntity(dto);
        
        System.out.println("toenity successfully save");
        AmcInvoice savedInvoice = invoiceRepository.save(invoice);
        
        log.info("Service Status: Saved invoice with ID: {}", savedInvoice.getInvoiceId());
        return toResponseDto(savedInvoice);
    }
    
    
    public String createMultipleInvoices(Integer jobId, Integer renewalJobId) {
    	
    	System.out.println("called createMultipleInvoices");
        
        // 1. Determine the source job details (AmcJob or AmcRenewalJob)
        BigDecimal jobAmount;
        String paymentTerm;
        LocalDate startDate;
        
        EnquiryType enquiryType = enquiryTypeRepository.findAll().stream()
        	    .filter(enq -> enq.getEnquiryTypeName().equalsIgnoreCase("amc"))
        	    .findFirst()
        	    .orElse(null);

        
        
        try {
            
            if (jobId != null) {
            	
            	 // --- Primary Check: AmcJob using jobId ---
                AmcJob amcJob = amcJobRepository.findById(jobId).orElse(null);
               
                jobAmount = amcJob.getJobAmount();
                paymentTerm = amcJob.getPaymentTerm();
                startDate = amcJob.getStartDate(); // Assuming AmcJob has a getStartDate()
                
                
                
            } else if (renewalJobId != null) {
                // --- Fallback Check: AmcRenewalJob using renewalJobId ---
                AmcRenewalJob renewalJob = amcRenewalJobRepository.findById(renewalJobId)
                    .orElseThrow(() -> new NoSuchElementException("Neither AMC Job nor Renewal Job found."));
                
                jobAmount = renewalJob.getJobAmount();
                paymentTerm = renewalJob.getPaymentTerm();
                startDate = renewalJob.getStartDate(); // Assuming AmcRenewalJob has a getStartDate()
            } else {
                // Neither ID worked, and renewalJobId is null
                 throw new NoSuchElementException("AMC Job not found, and no valid Renewal Job ID provided.");
            }
        } catch (NoSuchElementException e) {
            System.err.println("Error loading job data: " + e.getMessage());
            return "error: Job/Renewal data not found";
        }

        // 2. Input Validation (Essential before division)
        if (jobAmount == null || jobAmount.compareTo(BigDecimal.ZERO) <= 0) {
            System.err.println("Job amount is invalid for Job ID: " + jobId + " / Renewal Job ID: " + renewalJobId);
            return "error: Invalid Job Amount"; 
        }
        
        // Use the job's start date or today as a fallback
        LocalDate firstInvoiceDate = startDate != null ? startDate : LocalDate.now(); 

        // 3. Calculation Logic (Remains similar to previous correction)
        int monthsPerTerm; 
        if ("Monthly".equalsIgnoreCase(paymentTerm)) {
            monthsPerTerm = 1;
        } else if ("Quarterly".equalsIgnoreCase(paymentTerm)) {
            monthsPerTerm = 3;
        } else if ("Half Yearly".equalsIgnoreCase(paymentTerm)) {
            monthsPerTerm = 6;
        } else { // Includes "Annually" or any other unrecognized term
            monthsPerTerm = 12;
        }

        int noOfInvoicesToCreate = 12 / monthsPerTerm;

        // Use RoundingMode for financial calculations (2 decimal places)
        BigDecimal eachTermJobAmount = jobAmount.divide(new BigDecimal(noOfInvoicesToCreate), 2, RoundingMode.HALF_UP);
        
        // Placeholder/service method for getting the next formatted invoice number prefix
        String nextInvoiceNoPrefix = getNextInvoiceNoPrefix(); 

        // 4. Loop to Create Invoices
        for (int i = 1; i <= noOfInvoicesToCreate; i++) {
            
            AmcInvoiceRequestDto amcInvoiceRequestDto = new AmcInvoiceRequestDto();
            
            // Calculate Invoice Date
            LocalDate currentInvoiceDate;
            if (i > 1) {
                 // Increment date by the term length for subsequent invoices
                 currentInvoiceDate = firstInvoiceDate.plusMonths((long) (i - 1) * monthsPerTerm);
            } else {
                 currentInvoiceDate = firstInvoiceDate; 
            }

            amcInvoiceRequestDto.setInvoiceDate(currentInvoiceDate);

            // Generate Formatted Invoice Number
         //   String formattedInvoiceNo = String.format("%s-%03d", nextInvoiceNoPrefix, i);
            
            Integer nextInvoiceId = invoiceRepository.findMaxInvoiceId() + 1;
            String currentYear = String.valueOf(Year.now().getValue());
            String formattedInvoiceNo = String.format("INV-%s-%04d", currentYear, nextInvoiceId);

         
            amcInvoiceRequestDto.setInvoiceNo(formattedInvoiceNo);

            amcInvoiceRequestDto.setTotalAmt(eachTermJobAmount);
            amcInvoiceRequestDto.setIsCleared(0);
            
            // Ensure both job IDs are set, even if one was not used to fetch data, 
            // as the invoice links to both the original and renewal records.
            amcInvoiceRequestDto.setJobNo(jobId); 
            amcInvoiceRequestDto.setRenewlJobId(renewalJobId);
            
            amcInvoiceRequestDto.setEnquiryType(enquiryType);
            
         
            saveInvoice(amcInvoiceRequestDto);
        }
        
        return "success";
    }    
    
    private String getNextInvoiceNoPrefix() {
        // Implement logic to fetch the next sequential prefix (e.g., from a database sequence)
        // For this example, let's assume a placeholder logic:
        return "INV-" + LocalDate.now().getYear(); // e.g., "INV-2025"
    }
    
    

    // 4. Update an Invoice (by ID)
    public AmcInvoiceResponseDto updateInvoice(Integer id, AmcInvoiceRequestDto dto) {
        log.info("Service Call: Attempting to update invoice with ID: {}", id);
        
        AmcInvoice invoice = invoiceRepository.findById(id).orElseThrow(() -> {
            log.error("Service Error: Invoice not found for update with ID: {}", id);
            return new RuntimeException("Invoice not found with id " + id);
        });

        // 1. Fetch FK Entities (required for setting foreign key objects)
        AmcJob amcJob = fetchAmcJob(dto.getJobNo());
        AmcRenewalJob amcRenewalJob = fetchAmcRenewalJob(dto.getRenewlJobId());

        // 2. Merge DTO data into existing Entity
        invoice.setInvoiceNo(dto.getInvoiceNo());
        invoice.setInvoiceDate(dto.getInvoiceDate());
        invoice.setAmcJob(amcJob);
        invoice.setAmcRenewalJob(amcRenewalJob);
        invoice.setDescOfService(dto.getDescOfService());
        invoice.setSacCode(dto.getSacCode());
        invoice.setBaseAmt(dto.getBaseAmt());
        invoice.setCgstAmt(dto.getCgstAmt());
        invoice.setSgstAmt(dto.getSgstAmt());
        invoice.setTotalAmt(dto.getTotalAmt());
        invoice.setPayFor(dto.getPayFor());
        invoice.setIsCleared(dto.getIsCleared());
        
        // 3. Save and return DTO
        AmcInvoice updatedInvoice = invoiceRepository.save(invoice);
        log.info("Service Status: Successfully updated and saved invoice with ID: {}", id);
        
        return toResponseDto(updatedInvoice);
    }

    // 5. Delete an Invoice
    public void deleteInvoice(Integer id) {
        log.warn("Service Call: Attempting to delete invoice with ID: {}", id);
        if (!invoiceRepository.existsById(id)) {
            log.error("Service Error: Cannot delete. Invoice not found with ID: {}", id);
            throw new RuntimeException("Invoice not found with id " + id);
        }
        invoiceRepository.deleteById(id);
        log.info("Service Status: Invoice with ID: {} deleted successfully.", id);
    }
    
    
    @Transactional(readOnly = true) // Use Transactional for read performance/consistency
    public AmcInvoiceCountsDto getInvoiceSummaryCounts() {
        log.info("Calculating AMC Invoice summary counts.");
        
        // 1. Total Invoices (All)
        long totalInvoices = invoiceRepository.count();

        // 2. Paid Invoices (isCleared = 1)
        // Assuming '1' means cleared/paid based on your context.
        long paidInvoices = invoiceRepository.countByIsCleared(1);

        // 3. Pending Invoices (isCleared = 0)
        // Assuming '0' means pending based on your context.
        long pendingInvoices = invoiceRepository.countByIsCleared(0);

        // 4. Total Amount Received (Sum of totalAmt where isCleared = 1)
        Double totalAmountReceived = invoiceRepository.sumTotalAmountReceived();

        // Build and return the DTO
        return AmcInvoiceCountsDto.builder()
                .totalInvoices(totalInvoices)
                .paidInvoices(paidInvoices)
                .pendingInvoices(pendingInvoices)
                // Use a ternary operator to safely handle null result from SUM query
                .totalAmountReceived(totalAmountReceived != null ? totalAmountReceived : 0.0)
                .build();
    }
    
    
    public List<AmcInvoiceResponseDto> getAmcInvoiceResponseDtosByJobId(Integer jobId) {
        List<AmcInvoiceResponseDto> amcInvoiceResponseDtos = new ArrayList<>();

        AmcJob amcJob = amcJobRepository.findById(jobId).orElse(null);
        if (amcJob == null) {
            log.warn("AMC Job not found for ID: {}", jobId);
            return amcInvoiceResponseDtos;
        }

        List<AmcInvoice> amcInvoices = invoiceRepository.findByAmcJob(amcJob);
        if (amcInvoices.isEmpty()) {
            return amcInvoiceResponseDtos;
        }

        LocalDate currentDate = LocalDate.now();

        List<AmcInvoice> filteredInvoices = amcInvoices.stream()
            .filter(invoice -> {
                LocalDate invoiceDate = invoice.getInvoiceDate();
                if (invoiceDate == null) return false;

                boolean isUpcomingWithinNextMonth = !invoiceDate.isBefore(currentDate)
                        && invoiceDate.isBefore(currentDate.plusMonths(2)); // next 2 months range

//                boolean isUnclearedPastDue = invoice.getIsCleared() != null && invoice.getIsCleared() == 0
//                        && invoiceDate.isBefore(currentDate);
                
                // Past due invoices where payment entry is NOT added (0)
                boolean isPaymentEntryNotAddedPastDue =
                        Integer.valueOf(0).equals(invoice.getIsPaymentEntryAdded())
                        && invoiceDate.isBefore(currentDate);

                return isUpcomingWithinNextMonth || isPaymentEntryNotAddedPastDue;
            })
            .collect(Collectors.toList());

        return filteredInvoices.stream()
            .map(this::toResponseDto)
            .collect(Collectors.toList());
    }
    
    public List<AmcInvoiceResponseDto> getAmcInvoiceResponseDtosByRenewalJobId(Integer renewalJobId) {
        List<AmcInvoiceResponseDto> amcInvoiceResponseDtos = new ArrayList<>();

        AmcRenewalJob renewalJob = amcRenewalJobRepository.findById(renewalJobId).orElse(null);
        if (renewalJob == null) {
            log.warn("AMC Renewal Job not found for ID: {}", renewalJobId);
            return amcInvoiceResponseDtos;
        }

        List<AmcInvoice> amcInvoices = invoiceRepository.findByAmcRenewalJob(renewalJob);
        if (amcInvoices.isEmpty()) {
            return amcInvoiceResponseDtos;
        }

        LocalDate currentDate = LocalDate.now();

        List<AmcInvoice> filteredInvoices = amcInvoices.stream()
            .filter(invoice -> {
                LocalDate invoiceDate = invoice.getInvoiceDate();
                if (invoiceDate == null) return false;

                boolean isUpcomingWithinNextMonth = !invoiceDate.isBefore(currentDate)
                        && invoiceDate.isBefore(currentDate.plusMonths(2)); // current & next month range

//                boolean isUnclearedPastDue = invoice.getIsCleared() != null && invoice.getIsCleared() == 0
//                        && invoiceDate.isBefore(currentDate);
                
                // Past due invoices where payment entry is NOT added (0)
                boolean isPaymentEntryNotAddedPastDue =
                        Integer.valueOf(0).equals(invoice.getIsPaymentEntryAdded())
                        && invoiceDate.isBefore(currentDate);

                return isUpcomingWithinNextMonth || isPaymentEntryNotAddedPastDue;
            })
            .collect(Collectors.toList());

        return filteredInvoices.stream()
            .map(this::toResponseDto)
            .collect(Collectors.toList());
    }
    
    
    
    public AmcInvoicePdfData amcInvoicePdfData(Integer invoiceId) {

        // --- Fetch Invoice ---
        AmcInvoice amcInvoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found with ID: " + invoiceId));

        // --- Company Settings ---
        CompanySetting companySetting = companySettingRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Company settings not configured"));

        // --- Customer & Site handling (prefer renewal if available) ---
        Customer customer = null;
        Site site = null;
        
        String buyerAddress = "";
        String siteName = "";
        String siteAddress = "";
        String buyerContactNumber = "";
        

        if (amcInvoice.getAmcRenewalJob() != null) {
            customer = amcInvoice.getAmcRenewalJob().getCustomer();
            site = amcInvoice.getAmcRenewalJob().getSite();
        } else if (amcInvoice.getAmcJob() != null) {
            customer = amcInvoice.getAmcJob().getCustomer();
            site = amcInvoice.getAmcJob().getSite();
        }
        
        if(customer!=null && site!=null) {
        	buyerAddress = site.getSiteAddress();
        	siteName = site.getSiteName();
        	siteAddress = site.getSiteAddress();
        	buyerContactNumber  = customer.getContactNumber();
        	
        }else {
        	
        	NewLeads lead = null;
        	
        	if(amcInvoice.getMaterialQuotation()!=null) {
        		
        		AmcJob amcJob = amcInvoice.getMaterialQuotation().getAmcJob();
        		AmcRenewalJob amcRenewalJob = amcInvoice.getMaterialQuotation().getAmcRenewalJob();
        		
        		if(amcJob!=null)
        			lead = amcJob.getLead();
        		else 
        			lead = amcRenewalJob.getLead();			
        	
        	}else if(amcInvoice.getOnCallQuotation()!=null) {
        		
        		lead = amcInvoice.getOnCallQuotation().getLead();
        		
        	}else {
        		
        		lead = amcInvoice.getModernization().getLead();
        	}
        	
        	buyerAddress = lead.getSiteAddress();
        	siteName = lead.getSiteName();
        	siteAddress = lead.getSiteAddress();
        	buyerContactNumber  = lead.getContactNo();
        
        }

     

        // --- GST Calculations ---
        BigDecimal baseAmount = amcInvoice.getTotalAmt();
        Double gstHalf = companySetting.getGstRateAmcTotalPercentage() / 2;

        BigDecimal CGST_Amount = calculateTaxAmount(baseAmount, gstHalf);
        BigDecimal SGST_Amount = calculateTaxAmount(baseAmount, gstHalf);

        // --- Total & Round-Off ---
        BigDecimal totalWithTax = baseAmount.add(CGST_Amount).add(SGST_Amount);
        Map<String, BigDecimal> roundData = calculateRoundOff(totalWithTax);

        BigDecimal roundedGrandTotal = roundData.get("roundedTotal");
        BigDecimal roundOffValue = roundData.get("roundOffValue");

        // --- Amount in Words ---
        String amountInWords = convertAmountToWords(roundedGrandTotal);

        // --- Build DTO ---
        AmcInvoicePdfData pdfData = AmcInvoicePdfData.builder()
                .companyName(companySetting.getCompanyName())
                .officeAddress(companySetting.getOfficeAddressLine1())
                .GSTIN_UIN(companySetting.getCompanyGst())
                .Contact_No(companySetting.getOfficeNumber())
                .E_mail(companySetting.getCompanyMail())

                .Invoice_No(amcInvoice.getInvoiceNo())
                .Dated(amcInvoice.getInvoiceDate())

                .PurchaseOrderNo("")
                .PurchaseOrderNoDated(null)
                .DeliveryChallanNo("")
                .DeliveryChallanNoDated(null)

                .BuyerAddress(buyerAddress)
                .GSTIN("") 
                .BuyerContactNo(buyerContactNumber)

                .sitename(siteName)
                .siteaddress(siteAddress)
                .Particulars("Maintenance & Repairs Service Of Elevators AMC Charges")
                .HSN_SAC(companySetting.getSacCodeAmc())
                .Quantity(1)
                .rate(baseAmount)
                .per(0)
                .Amount(baseAmount)
                .SubTotal(baseAmount)

                .CGST_Str(getCgstStr(companySetting))
                .SGST_Str(getSgstStr(companySetting))
                .CGST_Amount(CGST_Amount)
                .SGST_Amount(SGST_Amount)
                .RoundOffValue(roundOffValue)
                .GrandTotal(roundedGrandTotal)
                .AmountChargeableInWords(amountInWords)

                .Name(companySetting.getBankName())
                .AccountNumber(companySetting.getAccountNumber())
                .Branch(companySetting.getBranchName())
                .IFSC_CODE(companySetting.getIfscCode())
                .FOR(companySetting.getCompanyName())
                .build();

        return pdfData;
    }
    
    
    private String getCgstStr(CompanySetting companySetting) {
        double totalGst = companySetting.getGstRateAmcTotalPercentage();
        return "CGST @ " + (totalGst / 2) + "%";
    }

    private String getSgstStr(CompanySetting companySetting) {
        double totalGst = companySetting.getGstRateAmcTotalPercentage();
        return "SGST @ " + (totalGst / 2) + "%";
    }

    private BigDecimal calculateTaxAmount(BigDecimal baseAmount, Double percentage) {
        if (baseAmount == null || percentage == null) return BigDecimal.ZERO;
        BigDecimal rate = BigDecimal.valueOf(percentage)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        return baseAmount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    private Map<String, BigDecimal> calculateRoundOff(BigDecimal totalWithTax) {
        BigDecimal roundedGrandTotal = totalWithTax.setScale(0, RoundingMode.HALF_UP);
        BigDecimal roundOffValue = roundedGrandTotal.subtract(totalWithTax)
                .setScale(2, RoundingMode.HALF_UP);

        Map<String, BigDecimal> result = new HashMap<>();
        result.put("roundedTotal", roundedGrandTotal);
        result.put("roundOffValue", roundOffValue);
        return result;
    }

    private String convertAmountToWords(BigDecimal amount) {
        if (amount == null) return "";
        long rupees = amount.longValue();
        int paise = amount.remainder(BigDecimal.ONE)
                          .multiply(BigDecimal.valueOf(100))
                          .intValue();

        String words = "Rupees " + numberToWords(rupees);
        if (paise > 0) {
            words += " and " + numberToWords(paise) + " Paise";
        }
        return words + " Only";
    }

    private String numberToWords(long number) {
        String[] units = {
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
            "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
            "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
        };

        String[] tens = {
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
        };

        if (number == 0) return "Zero";

        StringBuilder words = new StringBuilder();

        if ((number / 10000000) > 0) {
            words.append(numberToWords(number / 10000000)).append(" Crore ");
            number %= 10000000;
        }
        if ((number / 100000) > 0) {
            words.append(numberToWords(number / 100000)).append(" Lakh ");
            number %= 100000;
        }
        if ((number / 1000) > 0) {
            words.append(numberToWords(number / 1000)).append(" Thousand ");
            number %= 1000;
        }
        if ((number / 100) > 0) {
            words.append(numberToWords(number / 100)).append(" Hundred ");
            number %= 100;
        }

        if (number > 0) {
            if (words.length() > 0) words.append("and ");
            if (number < 20) {
                words.append(units[(int) number]);
            } else {
                words.append(tens[(int) (number / 10)]);
                if ((number % 10) > 0)
                    words.append(" ").append(units[(int) (number % 10)]);
            }
        }

        return words.toString().trim();
    }

//	public List<AmcInvoiceResponseDto> getAmcInvoiceResponseDtosByMaterialQuotationId(Integer materialQuotationId) {
//		// TODO Auto-generated method stub
//		
//		
//		// Call the custom repository method directly
//	    List<AmcInvoice> filteredInvoices = invoiceRepository
//	        .findByMaterialQuotation_ModQuotIdAndIsCleared(materialQuotationId, 0);
//		
//		return filteredInvoices.stream()
//	            .map(this::toResponseDto)
//	            .collect(Collectors.toList());
//	}
    
    public List<AmcInvoiceResponseDto> getAmcInvoiceResponseDtosByMaterialQuotationId(
            Integer materialQuotationId) {

        List<AmcInvoice> filteredInvoices = invoiceRepository
                .findByMaterialQuotation_ModQuotIdAndIsPaymentEntryAdded(
                        materialQuotationId, 0
                );

        return filteredInvoices.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }


	
	// In AmcInvoiceService.java

	// Assuming 'invoiceRepository' is AmcInvoiceRepository
	// and 'this::toResponseDto' is a helper method available in this service

	/**
	 * Retrieves uncleared AMC Invoices associated with a specific On Call Quotation ID.
	 */
    public List<AmcInvoiceResponseDto> getAmcInvoiceResponseDtosByOnCallQuotationId(
            Integer onCallQuotationId) {

        List<AmcInvoice> filteredInvoices = invoiceRepository
                .findByOnCallQuotation_IdAndIsPaymentEntryAdded(
                        onCallQuotationId, 0
                );

        return filteredInvoices.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }


	/**
	 * Retrieves uncleared AMC Invoices associated with a specific Modernization ID.
	 */
    public List<AmcInvoiceResponseDto> getAmcInvoiceResponseDtosByModernizationId(
            Integer modernizationId) {

        List<AmcInvoice> filteredInvoices = invoiceRepository
                .findByModernization_IdAndIsPaymentEntryAdded(
                        modernizationId, 0
                );

        return filteredInvoices.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }



    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    


    
    
    
}