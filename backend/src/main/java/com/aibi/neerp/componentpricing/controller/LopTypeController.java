package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.LopTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.LopTypeResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.LopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lop-type")
@RequiredArgsConstructor
@Slf4j
public class LopTypeController {

    private final LopService lopService;

    // ---------- LopType ----------
    @PostMapping
    public ResponseEntity<ApiResponse<LopTypeResponseDTO>> createLopType(@Valid @RequestBody LopTypeRequestDTO dto) {
        log.info("API: Create LopType");
        return ResponseEntity.ok(new ApiResponse<>(true, "LopType created successfully", lopService.createLopType(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LopTypeResponseDTO>> updateLopType(@PathVariable Integer id, @Valid @RequestBody LopTypeRequestDTO dto) {
        log.info("API: Update LopType ID {}", id);
        return ResponseEntity.ok(new ApiResponse<>(true, "LopType updated successfully", lopService.updateLopType(id, dto)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LopTypeResponseDTO>>> getAllLopTypes() {
        return ResponseEntity.ok(new ApiResponse<>(true, "LopTypes fetched successfully", lopService.getAllLopTypes()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteLopType(@PathVariable Integer id) {
        lopService.deleteLopType(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "LopType deleted successfully", null));
    }
}
