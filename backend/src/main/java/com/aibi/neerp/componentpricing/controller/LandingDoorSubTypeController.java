package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.dto.LandingDoorSubTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.LandingDoorSubTypeResponseDTO;
import com.aibi.neerp.componentpricing.service.LandingDoorSubTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/landing-door-subType")
@RequiredArgsConstructor
public class LandingDoorSubTypeController {

    private final LandingDoorSubTypeService service;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> create(@Valid @RequestBody LandingDoorSubTypeRequestDTO dto){
        return ResponseEntity.ok(new ApiResponse<>(true, "Created successfully", service.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LandingDoorSubTypeResponseDTO>> update(@PathVariable int id, @RequestBody LandingDoorSubTypeRequestDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Updated successfully", service.update(id, dto)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LandingDoorSubTypeResponseDTO>>> getAll() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched successfully", service.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LandingDoorSubTypeResponseDTO>> getById(@PathVariable int id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched successfully", service.getById(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Deleted successfully", null));
    }
}
