package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.CounterFrameRequestDTO;
import com.aibi.neerp.componentpricing.dto.CounterFrameResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.CounterFrameService;
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
public class CounterFrameController {

    private final CounterFrameService service;

    @GetMapping
    public ResponseEntity<List<CounterFrameResponseDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CounterFrameResponseDTO>> create(
            @Valid @RequestBody CounterFrameRequestDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CounterFrameResponseDTO>> update(
            @PathVariable Integer id,
            @Valid @RequestBody CounterFrameRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        return ResponseEntity.ok(service.delete(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CounterFrameResponseDTO>> search(
            @RequestParam Integer counterFrameTypeId,
            @RequestParam Integer capacityTypeId,
            @RequestParam Integer capacityValue,
            @RequestParam Integer machineTypeId) {

        return ResponseEntity.ok(
                service.search(counterFrameTypeId, capacityTypeId, capacityValue, machineTypeId)
        );
    }

}