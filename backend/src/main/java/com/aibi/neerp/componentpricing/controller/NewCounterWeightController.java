package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.dto.NewCounterWeightRequestDTO;
import com.aibi.neerp.componentpricing.dto.NewCounterWeightResponseDTO;
import com.aibi.neerp.componentpricing.service.NewCounterWeightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/new-counter-weights")
@RequiredArgsConstructor
public class NewCounterWeightController {

    private final NewCounterWeightService service;

    @GetMapping
    public ResponseEntity<List<NewCounterWeightResponseDTO>> getAll() {
        log.info("API: GET all NewCounterWeight");
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NewCounterWeightResponseDTO>> create(
            @Valid @RequestBody NewCounterWeightRequestDTO dto) {
        log.info("API: CREATE NewCounterWeight");
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NewCounterWeightResponseDTO>> update(
            @PathVariable Integer id,
            @Valid @RequestBody NewCounterWeightRequestDTO dto) {
        log.info("API: UPDATE NewCounterWeight id={}", id);
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        log.warn("API: DELETE NewCounterWeight id={}", id);
        return ResponseEntity.ok(service.delete(id));
    }
}
