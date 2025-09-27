package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.CounterFrameTypeRequestDTOold;
import com.aibi.neerp.componentpricing.dto.CounterFrameTypeResponseDTOold;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.CounterFrameTypeServiceold;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/counter-frame-types-old")
@RequiredArgsConstructor
public class CounterFrameTypeControllerold {

    private final CounterFrameTypeServiceold service;

    @GetMapping
    public ResponseEntity<List<CounterFrameTypeResponseDTOold>> getAll() {
        log.info("API Call: Get all Counter Frame Types");
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CounterFrameTypeResponseDTOold>> create(
            @Valid @RequestBody CounterFrameTypeRequestDTOold dto) {
        log.info("API Call: Create Counter Frame Type");
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CounterFrameTypeResponseDTOold>> update(
            @PathVariable Integer id,
            @Valid @RequestBody CounterFrameTypeRequestDTOold dto) {
        log.info("API Call: Update Counter Frame Type ID {}", id);
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        log.info("API Call: Delete Counter Frame Type ID {}", id);
        return ResponseEntity.ok(service.delete(id));
    }
}
