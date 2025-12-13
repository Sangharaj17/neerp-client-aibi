package com.aibi.neerp.amc.jobs.initial.controller;

import com.aibi.neerp.amc.jobs.initial.dto.AddJobDetailsData;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobRequestDto;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobResponseDto;
import com.aibi.neerp.amc.jobs.initial.dto.AmcServiceAlertData;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.dto.SelectDetailForJob;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.context.annotation.Lazy;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/amc-jobs")
public class AmcJobsController {

    private final AmcJobsService amcJobsService;

    public AmcJobsController(@Lazy AmcJobsService amcJobsService) {
        this.amcJobsService = amcJobsService;
    }

    /**
     * Get all pending jobs (for dropdown or listing)
     */
    @GetMapping("/pending")
    public List<SelectDetailForJob> getPendingJobs() {
        return amcJobsService.getPendingJobs();
    }

    /**
     * Get detailed data for Add Job screen based on selected job details
     */
    @PostMapping("/get-add-job-details")
    public ResponseEntity<AddJobDetailsData> getAddJobDetailsData(
            @RequestBody SelectDetailForJob selectDetailForJob) {

        AddJobDetailsData jobDetails = amcJobsService.getAddJobDetailsData(selectDetailForJob);
        return ResponseEntity.ok(jobDetails);
    }

    @PostMapping("/get-add-job-details-for-new-installation")
    public ResponseEntity<AddJobDetailsData> getAddJobDetailsDataForNewInstallation(
            @RequestBody SelectDetailForJob selectDetailForJob) {

        AddJobDetailsData jobDetails = amcJobsService.getAddJobDetailsDataForNewInstallation(selectDetailForJob);
        return ResponseEntity.ok(jobDetails);
    }
    
    @PostMapping("/create-amc-job")
    public ResponseEntity<String> createAmcJob(@RequestBody AmcJobRequestDto dto) {
        log.info("Received request to create AMC Job with data: {}", dto);
        amcJobsService.createAmcJob(dto);
        log.info("AMC Job saved successfully");
        return ResponseEntity.ok("AMC Job saved successfully");
    }
    
//    @GetMapping("/getAllJobs")
//    public Page<AmcJobResponseDto> getAllJobs(
//            @RequestParam(defaultValue = "") String search,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size,
//            @RequestParam(defaultValue = "jobId") String sortBy,
//            @RequestParam(defaultValue = "asc") String direction
//    ) {
//        return amcJobsService.getAllJobs(search, page, size, sortBy, direction);
//    }
    
    @GetMapping("/getAllJobs")
    public Page<AmcJobResponseDto> getAllJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateSearch,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "jobId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        log.info("Request received to fetch AMC Jobs with search='{}', date='{}'", search, dateSearch);
        return amcJobsService.getAllJobs(search, dateSearch, page, size, sortBy, direction);
    }
    
    @GetMapping("/export")
    public ResponseEntity<List<AmcJobResponseDto>> exportAllJobs() {
        List<AmcJobResponseDto> jobs = amcJobsService.getAllJobsForExport();

        if (jobs.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(jobs);
    }
    
    @GetMapping("/getAllActiveJobs")
    public List<JobDropdownResponse> getAllActiveJobs() {
        log.info("API Call: Get all active jobs with customer + site names");

        return amcJobsService.getAllActiveJobs().stream()
                .map(job -> new JobDropdownResponse(
                        job.getJobId(),
                        job.getCustomer() != null ? job.getCustomer().getCustomerName() : "Unknown Customer",
                        job.getSite() != null ? job.getSite().getSiteName() : "Unknown Site",
                        job.getLead().getEmailId()
                ))
                .collect(Collectors.toList());
    }

    // Updated record to include customer name
    public record JobDropdownResponse(Integer jobId, String customerName, String siteName , String mailId) {}

    
    @GetMapping("/getAllLiftsForAddBreakDownTodo")
    public List<LiftData> getAllLiftsForAddBreakDownTodoByJobId(Integer jobId) {
        return amcJobsService.getAllLiftsForAddBreakDownTodo(jobId);
    }
    
    @GetMapping("/amc-service-alerts")
    public Page<AmcServiceAlertData> getAmcServiceAlerts(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "jobId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return amcJobsService.serviceAlertDatas(search, page, size, sortBy, direction);
    }

    
    
}
