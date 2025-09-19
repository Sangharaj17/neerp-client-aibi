package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.LopSubTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.LopSubTypeResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.LopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lop-sub-type")
@RequiredArgsConstructor
@Slf4j
public class LopSubTypeController {

    private final LopService lopService;

    // ---------- LopSubType ----------
    @PostMapping
    public ResponseEntity<ApiResponse<LopSubTypeResponseDTO>> createLopSubType(@Valid @RequestBody LopSubTypeRequestDTO dto) {
        log.info("API: Create LopSubType");
        return ResponseEntity.ok(new ApiResponse<>(true, "LopSubType created successfully", lopService.createLopSubType(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LopSubTypeResponseDTO>> updateLopSubType(@PathVariable Integer id, @Valid @RequestBody LopSubTypeRequestDTO dto) {
        log.info("API: Update LopSubType ID {}", id);
        return ResponseEntity.ok(new ApiResponse<>(true, "LopSubType updated successfully", lopService.updateLopSubType(id, dto)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LopSubTypeResponseDTO>>> getAllLopSubTypes() {
        return ResponseEntity.ok(new ApiResponse<>(true, "LopSubTypes fetched successfully", lopService.getAllLopSubTypes()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteLopSubType(@PathVariable Integer id) {
        lopService.deleteLopSubType(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "LopSubType deleted successfully", null));
    }
}
