package com.aibi.neerp.quotation.jobs.controller;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.quotation.jobs.dto.QuotationJobRequestDTO;
import com.aibi.neerp.quotation.jobs.dto.QuotationJobResponseDTO;
import com.aibi.neerp.quotation.jobs.service.QuotationJobsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Slf4j
public class QuotationJobsController {

    private final QuotationJobsService service;

    @PostMapping
    public ResponseEntity<ApiResponse<QuotationJobResponseDTO>> create(@RequestBody QuotationJobRequestDTO dto) {
        log.info("Request to create job");
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<QuotationJobResponseDTO>> update(@PathVariable Integer id,
                                                                 @RequestBody QuotationJobRequestDTO dto) {
        log.info("Request to update job {}", id);
        ApiResponse<QuotationJobResponseDTO> response = service.update(id, dto);
        
        if (!response.isSuccess()) {
             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuotationJobResponseDTO>> get(@PathVariable Integer id) {
        log.info("Request to get job {}", id);
        ApiResponse<QuotationJobResponseDTO> response = service.getById(id);

        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuotationJobResponseDTO>>> getAll() {
        log.info("Request to get all jobs");
        return ResponseEntity.ok(service.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        log.info("Request to delete job {}", id);
        ApiResponse<String> response = service.delete(id);
        
        if (!response.isSuccess()) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }
}
