package com.aibi.neerp.amc.jobs.renewal.controller;

import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aibi.neerp.amc.jobs.initial.dto.BreakdownTodoRequestDto;
import com.aibi.neerp.amc.jobs.initial.dto.BreakdownTodoResponseDto;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.renewal.service.BreakdownTodoRenewalJobsService;

@Slf4j
@RestController
@RequestMapping("/api/renewal/breakdown-todo")
public class BreakdownTodoRenewalJobsController {

    @Autowired
    private BreakdownTodoRenewalJobsService breakdownTodoRenewalService;

    @PostMapping
    public ResponseEntity<String> createBreakdownTodo(@RequestBody BreakdownTodoRequestDto dto) {
        log.info("Received request to create BreakdownTodo For Renewal Jobs");
        String message = breakdownTodoRenewalService.createBreakdownTodo(dto);
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }
    
    @GetMapping("/job/{renewalJobId}")
    public List<BreakdownTodoResponseDto> getTodosByRenewalJob(@PathVariable Integer renewalJobId) {
        return breakdownTodoRenewalService.getByRenewalJobId(renewalJobId);
    }
    
    @GetMapping("/getLiftsByBreakDownId/{breakdownid}")
    public List<LiftData> getLiftsByBreakDownId(@PathVariable Integer breakdownid) {
        return breakdownTodoRenewalService.getLiftDatasByBreakdownId(breakdownid);
    }


}

