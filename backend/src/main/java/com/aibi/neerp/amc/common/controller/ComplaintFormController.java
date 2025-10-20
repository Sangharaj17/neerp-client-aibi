package com.aibi.neerp.amc.common.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aibi.neerp.amc.common.dto.ComplaintFormEmpData;
import com.aibi.neerp.amc.common.service.ComplaintFormService;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobActivityRequestDto;
import com.aibi.neerp.amc.jobs.initial.dto.BreakdownTodoRequestDto;
import com.aibi.neerp.amc.jobs.initial.dto.BreakdownTodoResponseDto;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobActivityService;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;
import com.aibi.neerp.amc.jobs.initial.service.BreakdownTodoService;
import com.aibi.neerp.amc.jobs.renewal.service.AmcRenewalJobActivityService;
import com.aibi.neerp.amc.jobs.renewal.service.AmcRenewalJobsService;
import com.aibi.neerp.amc.jobs.renewal.service.BreakdownTodoRenewalJobsService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/amc/complaint-form")
@Slf4j
public class ComplaintFormController {
	
    @Autowired
    private ComplaintFormService complaintFormService;

    @Autowired
    private AmcJobsService amcJobsService;

    @Autowired
    private AmcRenewalJobsService amcRenewalJobsService;

    @Autowired
    private BreakdownTodoService breakdownTodoService;
    
    @Autowired
    private BreakdownTodoRenewalJobsService breakdownTodoRenewalService;
    
    @Autowired
    private AmcJobActivityService amcJobActivityService;
    
    @Autowired
    private AmcRenewalJobActivityService amcRenewalJobActivityService;

    // ---------------------------------------------------------------
    // Get Complaint Form Employee Data by Employee Code
    // ---------------------------------------------------------------
    @GetMapping("/getComplaintFormEmpDataByEmpCode/{emp_code}")
    public ResponseEntity<ComplaintFormEmpData> getComplaintFormEmpDataByEmpCode(@PathVariable String emp_code) {
        log.info("➡️ Entered getComplaintFormEmpDataByEmpCode() with emp_code: {}", emp_code);

        ComplaintFormEmpData complaintFormEmpData = complaintFormService.getComplaintFormEmpDataByEmpCode(emp_code);

        if (complaintFormEmpData != null) {
            log.info("✅ Successfully fetched ComplaintFormEmpData for emp_code: {}", emp_code);
        } else {
            log.warn("⚠️ No ComplaintFormEmpData found for emp_code: {}", emp_code);
        }

        return ResponseEntity.ok(complaintFormEmpData);
    }

    // ---------------------------------------------------------------
    // Get All Lifts for Breakdown Todo (Initial Jobs)
    // ---------------------------------------------------------------
    @GetMapping("/getAllLiftsForAddBreakDownTodo")
    public List<LiftData> getAllLiftsForAddBreakDownTodoByJobId(@RequestParam Integer jobId) {
        log.info("➡️ Entered getAllLiftsForAddBreakDownTodoByJobId() with jobId: {}", jobId);

        List<LiftData> lifts = amcJobsService.getAllLiftsForAddBreakDownTodo(jobId);

        log.info("✅ Retrieved {} lifts for jobId: {}", lifts.size(), jobId);
        return lifts;
    }

    // ---------------------------------------------------------------
    // Get All Lifts for Breakdown Todo (Renewal Jobs)
    // ---------------------------------------------------------------
    @GetMapping("/getAllRenewalLiftsForAddBreakDownTodo")
    public List<LiftData> getAllRenewalLiftsForAddBreakDownTodoByJobId(@RequestParam Integer jobId) {
        log.info("➡️ Entered getAllRenewalLiftsForAddBreakDownTodoByJobId() with jobId: {}", jobId);

        List<LiftData> lifts = amcRenewalJobsService.getAllLiftsForAddBreakDownTodo(jobId);

        log.info("✅ Retrieved {} renewal lifts for jobId: {}", lifts.size(), jobId);
        return lifts;
    }

    // ---------------------------------------------------------------
    // Create Breakdown Todo
    // ---------------------------------------------------------------
    @PostMapping("/create-breakdown-todo")
    public ResponseEntity<String> createBreakdownTodo(@RequestBody BreakdownTodoRequestDto dto) {
        log.info("➡️ Received request to create BreakdownTodo with DTO: {}", dto);

        try {
            String message = breakdownTodoService.createBreakdownTodo(dto);
            log.info("✅ BreakdownTodo created successfully: {}", message);
            return new ResponseEntity<>(message, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("❌ Error while creating BreakdownTodo: {}", e.getMessage(), e);
            return new ResponseEntity<>("Failed to create BreakdownTodo", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/create-renewal-breakdown-todo")
    public ResponseEntity<String> createRenewalBreakdownTodo(@RequestBody BreakdownTodoRequestDto dto) {
        log.info("Received request to create BreakdownTodo For Renewal Jobs");
        String message = breakdownTodoRenewalService.createBreakdownTodo(dto);
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }
    
    // here start api calling for add breakdown activities 
    
    @GetMapping("/getTodosByJob/{jobId}")
    public List<BreakdownTodoResponseDto> getTodosByJob(@PathVariable Integer jobId) {
        return breakdownTodoService.getByJobId(jobId);
    }
    
    @GetMapping("/getLiftsByBreakDownId/{breakdownid}")
    public List<LiftData> getLiftsByBreakDownId(@PathVariable Integer breakdownid) {
        return breakdownTodoService.getLiftDatasByBreakdownId(breakdownid);
    }
    
    @GetMapping("/getTodosByRenewalJob/{renewalJobId}")
    public List<BreakdownTodoResponseDto> getTodosByRenewalJob(@PathVariable Integer renewalJobId) {
        return breakdownTodoRenewalService.getByRenewalJobId(renewalJobId);
    }
    
    @GetMapping("/getRenewalLiftsByBreakDownId/{breakdownid}")
    public List<LiftData> getRenewalLiftsByBreakDownId(@PathVariable Integer breakdownid) {
        return breakdownTodoRenewalService.getLiftDatasByBreakdownId(breakdownid);
    }
    
    @PostMapping("/add-amc-job-activity")
    public ResponseEntity<String> addJobActivity(@RequestBody AmcJobActivityRequestDto dto) {
        log.info("API Call: Add job activity for jobId: {}", dto.getJobId());

        amcJobActivityService.addJobActivity(dto);

        return ResponseEntity.ok("Job activities added successfully");
    }
    
    @PostMapping("/add-amc-renewal-job-activity")
    public ResponseEntity<String> addAmcRenewalJobActivity(@RequestBody AmcJobActivityRequestDto dto) {
        log.info("API Call: Add renewal job activity for jobId: {}", dto.getJobId());

        amcRenewalJobActivityService.addJobActivity(dto);

        return ResponseEntity.ok("Job renewal activities added successfully");
    }
    
    
    
}
