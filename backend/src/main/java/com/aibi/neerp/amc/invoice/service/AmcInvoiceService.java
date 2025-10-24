package com.aibi.neerp.amc.invoice.service;

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

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoField;
import java.util.List;
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

        return AmcInvoice.builder()
                .invoiceNo(dto.getInvoiceNo())
                .invoiceDate(dto.getInvoiceDate())
                .descOfService(dto.getDescOfService())
                .sacCode(dto.getSacCode())
                .baseAmt(dto.getBaseAmt())
                .cgstAmt(dto.getCgstAmt())
                .sgstAmt(dto.getSgstAmt())
                .totalAmt(dto.getTotalAmt())
                .payFor(dto.getPayFor())
                .isCleared(dto.getIsCleared())
                .amcJob(amcJob)
                .amcRenewalJob(amcRenewalJob)
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
        dto.setPayFor(entity.getPayFor());
        dto.setIsCleared(entity.getIsCleared());
        
        // Extract FK IDs from Entity objects
        dto.setJobNo(Optional.ofNullable(entity.getAmcJob()).map(AmcJob::getJobId).orElse(null));
        dto.setRenewlJobId(Optional.ofNullable(entity.getAmcRenewalJob()).map(AmcRenewalJob::getRenewalJobId).orElse(null));
        
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
            LocalDate dateSearch, 
            int page, 
            int size, 
            String sortBy, 
            String direction) {
        
        log.info("Fetching AMC Invoices (Pending/Current-Next Month) with search='{}', date='{}', page={}, size={}, sortBy={}, direction={}", 
                 search, dateSearch, page, size, sortBy, direction);

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

        // 4. Execute the complex search query with the new month filters
        // The repository method MUST now accept currentMonth and nextMonth
        Page<AmcInvoice> results = invoiceRepository.searchAllInvoices(
                finalSearch,
                dateSearch, 
                currentMonth, // NEW parameter
                nextMonth,    // NEW parameter
                pageable
        );

        System.out.println("found results");
        // 5. Convert the Page of Entities to a Page of DTOs
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

        try {
            // --- Primary Check: AmcJob using jobId ---
            AmcJob amcJob = amcJobRepository.findById(jobId).orElse(null);
            
            if (amcJob != null) {
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
            String formattedInvoiceNo = String.format("%s-%03d", nextInvoiceNoPrefix, i);
            amcInvoiceRequestDto.setInvoiceNo(formattedInvoiceNo);

            amcInvoiceRequestDto.setTotalAmt(eachTermJobAmount);
            amcInvoiceRequestDto.setIsCleared(0);
            
            // Ensure both job IDs are set, even if one was not used to fetch data, 
            // as the invoice links to both the original and renewal records.
            amcInvoiceRequestDto.setJobNo(jobId); 
            amcInvoiceRequestDto.setRenewlJobId(renewalJobId);
            
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
}