package com.aibi.neerp.componentpricing.controller;


import com.aibi.neerp.componentpricing.dto.LightFittingRequestDTO;
import com.aibi.neerp.componentpricing.dto.LightFittingResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.LightFittingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/light-fittings")
@RequiredArgsConstructor
@Slf4j
public class LightFittingController {

    private final LightFittingService service;

    @PostMapping
    public ResponseEntity<ApiResponse<LightFittingResponseDTO>> create(
            @Valid @RequestBody LightFittingRequestDTO request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Light fitting created successfully", service.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LightFittingResponseDTO>> update(
            @PathVariable Integer id, @Valid @RequestBody LightFittingRequestDTO request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Light fitting updated successfully", service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Light fitting deleted successfully", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LightFittingResponseDTO>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Light fitting retrieved successfully", service.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LightFittingResponseDTO>>> getAll() {
        return ResponseEntity.ok(new ApiResponse<>(true, "All light fittings retrieved successfully", service.getAll()));
    }
}
