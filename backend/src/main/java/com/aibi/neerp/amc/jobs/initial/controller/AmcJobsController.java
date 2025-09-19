package com.aibi.neerp.amc.jobs.initial.controller;

import com.aibi.neerp.amc.jobs.initial.dto.AddJobDetailsData;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobRequestDto;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobResponseDto;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.dto.SelectDetailForJob;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/amc-jobs")
public class AmcJobsController {

    private final AmcJobsService amcJobsService;

    public AmcJobsController(AmcJobsService amcJobsService) {
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
    
    @PostMapping("/create-amc-job")
    public ResponseEntity<String> createAmcJob(@RequestBody AmcJobRequestDto dto) {
        log.info("Received request to create AMC Job with data: {}", dto);
        amcJobsService.createAmcJob(dto);
        log.info("AMC Job saved successfully");
        return ResponseEntity.ok("AMC Job saved successfully");
    }
    
    @GetMapping("/getAllJobs")
    public Page<AmcJobResponseDto> getAllJobs(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "jobId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return amcJobsService.getAllJobs(search, page, size, sortBy, direction);
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
    
    
}
