package com.aibi.neerp.amc.jobs.renewal.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aibi.neerp.amc.jobs.initial.controller.AmcJobsController.JobDropdownResponse;
import com.aibi.neerp.amc.jobs.initial.dto.AddJobDetailsData;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobRequestDto;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobResponseDto;
import com.aibi.neerp.amc.jobs.initial.dto.AmcServiceAlertData;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.dto.SelectDetailForJob;
import com.aibi.neerp.amc.jobs.renewal.dto.AddRenewalJobDetailsData;
import com.aibi.neerp.amc.jobs.renewal.dto.AmcRenewalJobRequestDto;
import com.aibi.neerp.amc.jobs.renewal.dto.AmcRenewalJobResponseDto;
import com.aibi.neerp.amc.jobs.renewal.dto.SelectDetailForRenewalJob;
import com.aibi.neerp.amc.jobs.renewal.service.AmcRenewalJobsService;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/api/amc-renewal-jobs")
public class AmcRenewalJobsController {

	@Autowired
    private  AmcRenewalJobsService amcRenewalJobsService;
    /**
     * Get all pending jobs (for dropdown or listing)
     */
    @GetMapping("/pendingRenewalJobs")
    public List<SelectDetailForRenewalJob> getPendingJobs() {
        return amcRenewalJobsService.getPendingRenewalJobs();
    }
    
    @PostMapping("/get-add-renewal-job-details")
    public ResponseEntity<AddRenewalJobDetailsData> getAddRenewalJobDetailsData(
            @RequestBody SelectDetailForRenewalJob selectDetailForRenwalJob) {

    	AddRenewalJobDetailsData jobDetails = amcRenewalJobsService.getAddRenewalJobDetailsData(selectDetailForRenwalJob);
        return ResponseEntity.ok(jobDetails);
    }
    
    @PostMapping("/create-amc-renewal-job")
    public ResponseEntity<String> createAmcRenewalJob(@RequestBody AmcRenewalJobRequestDto dto) {
        log.info("Received request to create AMC Renewal Job with data: {}", dto);
        amcRenewalJobsService.createAmcRenewalJob(dto);
        log.info("AMC Renewal Job saved successfully");
        return ResponseEntity.ok("AMC Renewal Job saved successfully");
    }
    
    @GetMapping("/getAllRenewalJobs")
    public Page<AmcRenewalJobResponseDto> getAllRenewalJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateSearch,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "renewalJobId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        log.info("Request received to fetch AMC Renewal Jobs with search='{}', date='{}'", search, dateSearch);
        return amcRenewalJobsService.getAllRenewalJobs(search, dateSearch, page, size, sortBy, direction);
    }
    
    @GetMapping("/exportRenewal") // New endpoint for export
    public ResponseEntity<List<AmcRenewalJobResponseDto>> exportAllRenewalJobs() {
        log.info("Request received to export all AMC Renewal Jobs");
        List<AmcRenewalJobResponseDto> jobs = amcRenewalJobsService.getAllRenewalJobsForExport();

        if (jobs.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(jobs);
    }
    
    @GetMapping("/getAllActiveRenewalJobs")
    public List<JobDropdownResponse> getAllActiveRenewalJobs() {
        log.info("API Call: Get all active renewal jobs with customer + site names");

        return amcRenewalJobsService.getAllActiveRenewalJobs().stream()
                .map(job -> new JobDropdownResponse(
                        job.getRenewalJobId(),
                        job.getCustomer() != null ? job.getCustomer().getCustomerName() : "Unknown Customer",
                        job.getSite() != null ? job.getSite().getSiteName() : "Unknown Site",
                        job.getLead().getEmailId(),
                        "renewal"
                ))
                .collect(Collectors.toList());
    }

    // Updated record to include customer name
    public record JobDropdownResponse(Integer renewalJobId, String customerName, String siteName , String mailId , String renewal) {}

    
    @GetMapping("/getAllRenewalLiftsForAddBreakDownTodo")
    public List<LiftData> getAllLiftsForAddBreakDownTodoByJobId(Integer jobId) {
    	
        return amcRenewalJobsService.getAllLiftsForAddBreakDownTodo(jobId);
    }
    
    @GetMapping("/amc-renewal-alerts")
    public Page<AmcServiceAlertData> getAmcRenewalAlerts( // Return type is the reused DTO
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "renewalJobId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        return amcRenewalJobsService.serviceAlertDatas(search, page, size, sortBy, direction);
    }
    
    
}