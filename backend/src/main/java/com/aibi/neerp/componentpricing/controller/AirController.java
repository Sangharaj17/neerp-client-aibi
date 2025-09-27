package com.aibi.neerp.componentpricing.controller;


import com.aibi.neerp.componentpricing.dto.AirSystemRequestDTO;
import com.aibi.neerp.componentpricing.dto.AirSystemResponseDTO;
import com.aibi.neerp.componentpricing.dto.AirTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.AirTypeResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.AirService;
import com.aibi.neerp.exception.ResourceNotFoundException;
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

    @PostMapping("/air-system/price")
    public ResponseEntity<ApiResponse<AirSystemResponseDTO>> getAirSystemPrice(
            @Valid @RequestBody AirSystemRequestDTO dto) {

        log.info("Fetching AirSystem price for AirTypeId={}, CapacityTypeId={}, CapacityValueId={}",
                dto.getAirTypeId(), dto.getCapacityTypeId(),
                dto.getPersonId() != null ? dto.getPersonId() : dto.getWeightId());

        try {
            AirSystemResponseDTO response = airService.getAirSystemPrice(dto);
            return ResponseEntity.ok(new ApiResponse<>(true, "AirSystem price fetched successfully", response));
        } catch (ResourceNotFoundException ex) {
            // return 200 OK with success=false instead of throwing 404
            return ResponseEntity.ok(new ApiResponse<>(false, "No matching AirSystem price found", null));
        }
    }


}
