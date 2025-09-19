package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.CounterFrameTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.CounterFrameTypeResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.CounterFrameTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/counter-frame-types")
@RequiredArgsConstructor
public class CounterFrameTypeController {

    private final CounterFrameTypeService service;

    @GetMapping
    public ResponseEntity<List<CounterFrameTypeResponseDTO>> getAll() {
        log.info("API Call: Get all Counter Frame Types");
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CounterFrameTypeResponseDTO>> create(
            @Valid @RequestBody CounterFrameTypeRequestDTO dto) {
        log.info("API Call: Create Counter Frame Type");
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CounterFrameTypeResponseDTO>> update(
            @PathVariable Integer id,
            @Valid @RequestBody CounterFrameTypeRequestDTO dto) {
        log.info("API Call: Update Counter Frame Type ID {}", id);
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        log.info("API Call: Delete Counter Frame Type ID {}", id);
        return ResponseEntity.ok(service.delete(id));
    }
}
