package com.aibi.neerp.quotation.jobsActivities.controller;

import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityTypeRequestDTO;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityTypeResponseDTO;
import com.aibi.neerp.quotation.jobsActivities.service.NiJobActivityTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ni-job-activity-types")
@Slf4j
@RequiredArgsConstructor
public class NiJobActivityTypeController {

    private final NiJobActivityTypeService service;

    @PostMapping
    public ResponseEntity<JobActivityTypeResponseDTO> create(
            @Valid @RequestBody JobActivityTypeRequestDTO request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobActivityTypeResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody JobActivityTypeRequestDTO request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobActivityTypeResponseDTO> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<JobActivityTypeResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
