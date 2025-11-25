package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.WireRopeRequestDTO;
import com.aibi.neerp.componentpricing.dto.WireRopeResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.WireRopeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/wire-ropes")
@RequiredArgsConstructor
public class WireRopeController {

    private final WireRopeService wireRopeService;

    @GetMapping
    public ResponseEntity<List<WireRopeResponseDTO>> getAllWireRopes() {
        log.info("API Call: Get All WireRopes");
        return ResponseEntity.ok(wireRopeService.findAll());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WireRopeResponseDTO>> createWireRope(
            @Valid @RequestBody WireRopeRequestDTO dto) {
        log.info("API Call: Create WireRope");
        return ResponseEntity.ok(wireRopeService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WireRopeResponseDTO>> updateWireRope(
            @PathVariable Integer id,
            @Valid @RequestBody WireRopeRequestDTO dto) {
        log.info("API Call: Update WireRope ID {}", id);
        return ResponseEntity.ok(wireRopeService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteWireRope(@PathVariable Integer id) {
        log.info("API Call: Delete WireRope ID {}", id);
        return ResponseEntity.ok(wireRopeService.delete(id));
    }

    @GetMapping("/floor/{floorId}")
    public ResponseEntity<List<WireRopeResponseDTO>> getWireRopesByFloor(@PathVariable Long floorId) {
        log.info("API Call: Get WireRopes by Floor ID {}", floorId);
        return ResponseEntity.ok(wireRopeService.findByFloorId(floorId));
    }

    @GetMapping("/floor/{floorId}/machine/{machineTypeId}")
    public ResponseEntity<List<WireRopeResponseDTO>> getWireRopesByFloorAndMachineType(
            @PathVariable Long floorId,
            @PathVariable Integer machineTypeId) { // Changed type from Long to Integer to match TypeOfLift/DTO

        log.info("API Call: Get WireRopes by Floor ID {} and Machine Type ID {}", floorId, machineTypeId);

        return ResponseEntity.ok(wireRopeService.findByFloorAndMachineType(floorId, machineTypeId));
    }


}
