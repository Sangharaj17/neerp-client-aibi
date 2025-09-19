package com.aibi.neerp.amc.common.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aibi.neerp.amc.common.dto.JobActivityTypeRequestDto;
import com.aibi.neerp.amc.common.dto.JobActivityTypeResponseDto;
import com.aibi.neerp.amc.common.service.JobActivityTypeService;

import java.util.List;

@RestController
@RequestMapping("/api/job-activity-types")
@RequiredArgsConstructor
@Slf4j
public class JobActivityTypeController {

    private final JobActivityTypeService service;

    @PostMapping
    public ResponseEntity<JobActivityTypeResponseDto> create(@RequestBody JobActivityTypeRequestDto requestDto) {
        log.info("Received request to create JobActivityType");
        return ResponseEntity.ok(service.create(requestDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobActivityTypeResponseDto> update(@PathVariable Long id,
                                                             @RequestBody JobActivityTypeRequestDto requestDto) {
        log.info("Received request to update JobActivityType with id {}", id);
        return ResponseEntity.ok(service.update(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("Received request to delete JobActivityType with id {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobActivityTypeResponseDto> getById(@PathVariable Long id) {
        log.info("Received request to fetch JobActivityType with id {}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<JobActivityTypeResponseDto>> getAll() {
        log.info("Received request to fetch all JobActivityTypes");
        return ResponseEntity.ok(service.getAll());
    }
}

