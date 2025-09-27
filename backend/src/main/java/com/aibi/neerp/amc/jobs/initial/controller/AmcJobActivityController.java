package com.aibi.neerp.amc.jobs.initial.controller;


import com.aibi.neerp.amc.jobs.initial.dto.AddServiceActivityGetData;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobActivityRequestDto;
import com.aibi.neerp.amc.jobs.initial.dto.JobDetailPageResponseDto;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJobActivity;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs/initial/amc-job-activities")
@RequiredArgsConstructor
@Slf4j
public class AmcJobActivityController {

    private final AmcJobActivityService amcJobActivityService;

    @PostMapping("/add")
    public ResponseEntity<String> addJobActivity(@RequestBody AmcJobActivityRequestDto dto) {
        log.info("API Call: Add job activity for jobId: {}", dto.getJobId());

        amcJobActivityService.addJobActivity(dto);

        return ResponseEntity.ok("Job activities added successfully");
    }
    
    @GetMapping("/getAddServiceActivityData/{jobId}")
    public ResponseEntity<AddServiceActivityGetData> getAddServiceActivityData(@PathVariable Integer jobId) {
        AddServiceActivityGetData response = amcJobActivityService.getAddServiceActivityGetData(jobId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/current-service-status/{jobId}")
    public ResponseEntity<String> getCurrentServiceStatus(@PathVariable Integer jobId) {
    	System.out.println("called getCurrentServiceStatus");
        String status = amcJobActivityService.getStatusOfCurrentService(jobId);
        return ResponseEntity.ok(status);
    }
    
    @GetMapping("/job-detail/{jobId}")
    public JobDetailPageResponseDto getJobDetail(@PathVariable Integer jobId) {
        return amcJobActivityService.getJobDetailPage(jobId);
    }

}

