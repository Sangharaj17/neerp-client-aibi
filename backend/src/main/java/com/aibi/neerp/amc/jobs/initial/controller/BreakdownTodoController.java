package com.aibi.neerp.amc.jobs.initial.controller;

import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aibi.neerp.amc.jobs.initial.dto.BreakdownTodoRequestDto;
import com.aibi.neerp.amc.jobs.initial.dto.BreakdownTodoResponseDto;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.service.BreakdownTodoService;

@Slf4j
@RestController
@RequestMapping("/api/breakdown-todo")
public class BreakdownTodoController {

    @Autowired
    private BreakdownTodoService breakdownTodoService;

    @PostMapping
    public ResponseEntity<String> createBreakdownTodo(@RequestBody BreakdownTodoRequestDto dto) {
        log.info("Received request to create BreakdownTodo");
        String message = breakdownTodoService.createBreakdownTodo(dto);
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }

    @PutMapping("/{custTodoId}")
    public ResponseEntity<String> updateBreakdownTodo(@PathVariable Integer custTodoId,
                                                     @RequestBody BreakdownTodoRequestDto dto) {
        log.info("Received request to update BreakdownTodo with id {}", custTodoId);
        String message = breakdownTodoService.updateBreakdownTodo(custTodoId, dto);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @DeleteMapping("/{custTodoId}")
    public ResponseEntity<String> deleteBreakdownTodo(@PathVariable Integer custTodoId) {
        log.info("Received request to delete BreakdownTodo with id {}", custTodoId);
        String message = breakdownTodoService.deleteBreakdownTodo(custTodoId);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
    
    @GetMapping("/job/{jobId}")
    public List<BreakdownTodoResponseDto> getTodosByJob(@PathVariable Integer jobId) {
    	System.out.println("calldeldeled");
        return breakdownTodoService.getByJobId(jobId);
    }
    
    @GetMapping("/getLiftsByBreakDownId/{breakdownid}")
    public List<LiftData> getLiftsByBreakDownId(@PathVariable Integer breakdownid) {
        return breakdownTodoService.getLiftDatasByBreakdownId(breakdownid);
    }
    
    @GetMapping("/notPerformed")
    public Page<BreakdownTodoResponseDto> getUpcomingTodos(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return breakdownTodoService.getUpcomingBreakdownTodos(search, pageable);
    }

    @GetMapping("/missed")
    public Page<BreakdownTodoResponseDto> getMissedTodos(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return breakdownTodoService.getMissedBreakdownTodos(search, pageable);
    }
}

