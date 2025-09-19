package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.UnitRequestDTO;
import com.aibi.neerp.componentpricing.dto.UnitResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.UnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/unit")
public class UnitController {

    @Autowired
    private UnitService unitService;

    @PostMapping
    public ResponseEntity<ApiResponse<UnitResponseDTO>> createUnit(@RequestBody UnitRequestDTO dto) {
        UnitResponseDTO created = unitService.create(dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Unit created successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UnitResponseDTO>>> getAllUnits() {
        List<UnitResponseDTO> list = unitService.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched all units", list));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UnitResponseDTO>> updateUnit(@PathVariable Integer id, @RequestBody UnitRequestDTO dto) {
        UnitResponseDTO updated = unitService.update(id, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Unit updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUnit(@PathVariable Integer id) {
        unitService.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Unit deleted successfully", null));
    }
}
