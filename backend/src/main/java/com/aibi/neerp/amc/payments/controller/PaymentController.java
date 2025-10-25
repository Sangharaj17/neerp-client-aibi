package com.aibi.neerp.amc.payments.controller;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aibi.neerp.amc.invoice.dto.AmcInvoiceResponseDto;
import com.aibi.neerp.amc.invoice.service.AmcInvoiceService;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;
import com.aibi.neerp.amc.jobs.renewal.service.AmcRenewalJobsService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/payments")
@Slf4j
public class PaymentController {

    @Autowired
    private AmcJobsService amcJobsService;

    @Autowired
    private AmcRenewalJobsService amcRenewalJobsService;
    
    @Autowired
    private AmcInvoiceService amcInvoiceService;

    /**
     * Get all active AMC Jobs (New Installation Jobs)
     */
    @GetMapping("/getAllActiveJobs")
    public List<JobDropdownResponse> getAllActiveJobs() {
        log.info("API Call: /payments/getAllActiveJobs - Fetching all active jobs");

        var jobs = amcJobsService.getAllActiveJobs();
        log.debug("Fetched {} active AMC jobs", jobs.size());

        return jobs.stream()
                .map(job -> new JobDropdownResponse(
                        job.getJobId(),
                        job.getCustomer() != null ? job.getCustomer().getCustomerName() : "Unknown Customer",
                        job.getSite() != null ? job.getSite().getSiteName() : "Unknown Site",
                        job.getLead() != null ? job.getLead().getEmailId() : "N/A"
                ))
                .collect(Collectors.toList());
    }

    /**
     * Get all active AMC Renewal Jobs
     */
    @GetMapping("/getAllActiveRenewalJobs")
    public List<RenewalJobDropdownResponse> getAllActiveRenewalJobs() {
        log.info("API Call: /payments/getAllActiveRenewalJobs - Fetching all active renewal jobs");

        var renewalJobs = amcRenewalJobsService.getAllActiveRenewalJobs();
        log.debug("Fetched {} active renewal jobs", renewalJobs.size());

        return renewalJobs.stream()
                .map(job -> new RenewalJobDropdownResponse(
                        job.getRenewalJobId(),
                        job.getCustomer() != null ? job.getCustomer().getCustomerName() : "Unknown Customer",
                        job.getSite() != null ? job.getSite().getSiteName() : "Unknown Site",
                        job.getLead() != null ? job.getLead().getEmailId() : "N/A",
                        "renewal"
                ))
                .collect(Collectors.toList());
    }

    /**
     * DTO for Normal AMC Jobs
     */
    public record JobDropdownResponse(
            Integer jobId,
            String customerName,
            String siteName,
            String mailId
    ) {}

    /**
     * DTO for Renewal Jobs
     */
    public record RenewalJobDropdownResponse(
            Integer renewalJobId,
            String customerName,
            String siteName,
            String mailId,
            String renewal
    ) {}
    
    
    
    @GetMapping("/invoices/by-job/{jobId}")
    public ResponseEntity<List<AmcInvoiceResponseDto>> getInvoicesByJobId(@PathVariable Integer jobId) {
        log.info("Request received to fetch AMC Invoices for jobId: {}", jobId);
        try {
            List<AmcInvoiceResponseDto> responseDtos = amcInvoiceService.getAmcInvoiceResponseDtosByJobId(jobId);

            if (responseDtos == null || responseDtos.isEmpty()) {
                log.info("No invoices found for jobId: {}", jobId);
                return ResponseEntity.noContent().build(); // HTTP 204
            }

            return ResponseEntity.ok(responseDtos); // HTTP 200
        } catch (Exception e) {
            log.error("Error while fetching AMC Invoices for jobId {}: {}", jobId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }
    
    @GetMapping("/invoices/by-renewal-job/{renewalJobId}")
    public ResponseEntity<List<AmcInvoiceResponseDto>> getInvoicesByRenewalJobId(@PathVariable Integer renewalJobId) {
        log.info("Request received to fetch AMC Invoices for renewalJobId: {}", renewalJobId);
        try {
            List<AmcInvoiceResponseDto> responseDtos = amcInvoiceService.getAmcInvoiceResponseDtosByRenewalJobId(renewalJobId);

            if (responseDtos == null || responseDtos.isEmpty()) {
                log.info("No invoices found for renewalJobId: {}", renewalJobId);
                return ResponseEntity.noContent().build(); // 204
            }

            return ResponseEntity.ok(responseDtos); // 200
        } catch (Exception e) {
            log.error("Error while fetching AMC Invoices for renewalJobId {}: {}", renewalJobId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    
    
    
    
    
    
    
}
