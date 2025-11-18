package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.CounterWeightRequestDTO;
import com.aibi.neerp.componentpricing.dto.CounterWeightResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.CounterWeightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/counter-weights")
@RequiredArgsConstructor
public class CounterWeightController {

    private final CounterWeightService service;

    @GetMapping
    public ResponseEntity<List<CounterWeightResponseDTO>> getAll() {
        log.info("API Request: Get all Counter Weights");
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CounterWeightResponseDTO>> create(
            @Valid @RequestBody CounterWeightRequestDTO dto) {
        log.info("API Request: Create Counter Weight");
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CounterWeightResponseDTO>> update(
            @PathVariable Integer id,
            @Valid @RequestBody CounterWeightRequestDTO dto) {
        log.info("API Request: Update Counter Weight with ID {}", id);
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        log.info("API Request: Delete Counter Weight with ID {}", id);
        return ResponseEntity.ok(service.delete(id));
    }

    @GetMapping("{operatorId}/floor/{floorId}")
    public ResponseEntity<List<CounterWeightResponseDTO>> getByFloor(@PathVariable Long operatorId, @PathVariable Long floorId) {
        log.info("API Request: Get Counter Weights for operator {} Floor ID {}", operatorId, floorId);
        return ResponseEntity.ok(service.findByOperatorTypeAndFloor(operatorId, floorId));
    }

}
