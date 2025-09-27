package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.FastenerRequestDTO;
import com.aibi.neerp.componentpricing.dto.FastenerResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.FastenerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fasteners")
@RequiredArgsConstructor
public class FastenerController {

    private final FastenerService fastenerService;

    @PostMapping
    public ResponseEntity<ApiResponse<FastenerResponseDTO>> createFastener(@Valid @RequestBody FastenerRequestDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Fastener created successfully", fastenerService.createFastener(dto)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FastenerResponseDTO>>> getAllFasteners() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Fasteners fetched successfully", fastenerService.getAllFasteners()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FastenerResponseDTO>> getFastenerById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Fastener fetched successfully", fastenerService.getFastenerById(id)));
    }

    @GetMapping("/floor/{floorId}")
    public ResponseEntity<ApiResponse<List<FastenerResponseDTO>>> getFastenersByFloor(@PathVariable Long floorId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Fasteners for floor fetched successfully", fastenerService.getFastenersByFloor(floorId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FastenerResponseDTO>> updateFastener(@PathVariable Integer id,
                                                                           @Valid @RequestBody FastenerRequestDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Fastener updated successfully", fastenerService.updateFastener(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteFastener(@PathVariable Integer id) {
        fastenerService.deleteFastener(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Fastener deleted successfully", null));
    }
}
