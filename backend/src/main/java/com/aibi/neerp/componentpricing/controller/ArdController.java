package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.ArdRequestDTO;
import com.aibi.neerp.componentpricing.dto.ArdResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.ArdService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/ardDevice")
@RequiredArgsConstructor
public class ArdController {

    private final ArdService ardService;

    @PostMapping
    public ResponseEntity<ApiResponse<ArdResponseDTO>> create(@Valid @RequestBody ArdRequestDTO dto) {
        log.info("API Call: Create ARD");
        return ResponseEntity.ok(ardService.createArd(dto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ArdResponseDTO>>> getAll() {
        log.info("API Call: Get All ARDs");
        return ResponseEntity.ok(ardService.getAllArdsSorted());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ArdResponseDTO>> getById(@PathVariable int id) {
        log.info("API Call: Get ARD by ID {}", id);
        return ResponseEntity.ok(ardService.getArdById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ArdResponseDTO>> update(@PathVariable int id, @Valid @RequestBody ArdRequestDTO dto) {
        log.info("API Call: Update ARD ID {}", id);
        return ResponseEntity.ok(ardService.updateArd(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable int id) {
        log.info("API Call: Delete ARD ID {}", id);
        return ResponseEntity.ok(ardService.deleteArd(id));
    }

    @GetMapping("/searchByOperatorAndCapacity")
    public ResponseEntity<ApiResponse<List<ArdResponseDTO>>> searchByOperatorAndCapacity(
            @RequestParam Integer operatorId,
            @RequestParam Integer capacityTypeId,
            @RequestParam Integer capacityValueId
    ) {
        log.info("API Call: Search ARDs by operatorId={}, capacityTypeId={}, capacityValueId={}", operatorId, capacityTypeId, capacityValueId);
        return ResponseEntity.ok(ardService.findByOperatorTypeAndCapacityValue(operatorId, capacityTypeId, capacityValueId));
    }



}
