package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.CopRequestDTO;
import com.aibi.neerp.componentpricing.dto.CopResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.CopService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/cops")
@RequiredArgsConstructor
public class CopController {

    private final CopService copService;

    @GetMapping
    public ResponseEntity<List<CopResponseDTO>> getAllCops() {
        log.info("Request received: Get all COPs");
        return ResponseEntity.ok(copService.findAllSorted());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CopResponseDTO>> createCop(@Valid @RequestBody CopRequestDTO DTO) {
        log.info("Request received: Create COP");
        return ResponseEntity.ok(copService.create(DTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CopResponseDTO>> updateCop(
            @PathVariable int id, @Valid @RequestBody CopRequestDTO DTO) {
        log.info("Request received: Update COP id={}", id);
        return ResponseEntity.ok(copService.update(id, DTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCop(@PathVariable int id) {
        log.info("Request received: Delete COP id={}", id);
        return ResponseEntity.ok(copService.delete(id));
    }
}
