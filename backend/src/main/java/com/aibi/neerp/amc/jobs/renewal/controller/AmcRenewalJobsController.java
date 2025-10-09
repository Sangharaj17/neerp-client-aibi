package com.aibi.neerp.amc.jobs.renewal.controller;

import java.time.LocalDate;
import java.util.List;

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

import com.aibi.neerp.amc.jobs.initial.dto.AddJobDetailsData;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobRequestDto;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobResponseDto;
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
    
    
}