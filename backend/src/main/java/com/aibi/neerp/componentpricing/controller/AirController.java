package com.aibi.neerp.componentpricing.controller;


import com.aibi.neerp.componentpricing.dto.AirSystemRequestDTO;
import com.aibi.neerp.componentpricing.dto.AirSystemResponseDTO;
import com.aibi.neerp.componentpricing.dto.AirTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.AirTypeResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.AirService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class AirController {

    private final AirService airService;

    // -------- AirType Endpoints --------
    @PostMapping("/air-type")
    public ResponseEntity<ApiResponse<AirTypeResponseDTO>> createAirType(
            @Valid @RequestBody AirTypeRequestDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "AirType created successfully",
                airService.createAirType(dto)));
    }

    @PutMapping("/air-type/{id}")
    public ResponseEntity<ApiResponse<AirTypeResponseDTO>> updateAirType(
            @PathVariable Integer id, @Valid @RequestBody AirTypeRequestDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "AirType updated successfully",
                airService.updateAirType(id, dto)));
    }

    @DeleteMapping("/air-type/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteAirType(@PathVariable Integer id) {
        airService.deleteAirType(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "AirType deleted successfully", null));
    }

    @GetMapping("/air-type")
    public ResponseEntity<ApiResponse<List<AirTypeResponseDTO>>> getAllAirTypes() {
        return ResponseEntity.ok(new ApiResponse<>(true, "AirTypes fetched successfully",
                airService.getAllAirTypes()));
    }

    // -------- AirSystem Endpoints --------
    @PostMapping("/air-system")
    public ResponseEntity<ApiResponse<AirSystemResponseDTO>> createAirSystem(
            @Valid @RequestBody AirSystemRequestDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "AirSystem created successfully",
                airService.createAirSystem(dto)));
    }

    @PutMapping("/air-system/{id}")
    public ResponseEntity<ApiResponse<AirSystemResponseDTO>> updateAirSystem(
            @PathVariable Integer id, @Valid @RequestBody AirSystemRequestDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "AirSystem updated successfully",
                airService.updateAirSystem(id, dto)));
    }

    @DeleteMapping("/air-system/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteAirSystem(@PathVariable Integer id) {
        airService.deleteAirSystem(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "AirSystem deleted successfully", null));
    }

    @GetMapping("/air-system")
    public ResponseEntity<ApiResponse<List<AirSystemResponseDTO>>> getAllAirSystems() {
        return ResponseEntity.ok(new ApiResponse<>(true, "AirSystems fetched successfully",
                airService.getAllAirSystems()));
    }
}
