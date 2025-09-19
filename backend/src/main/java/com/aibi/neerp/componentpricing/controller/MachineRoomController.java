package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.MachineRoomRequestDTO;
import com.aibi.neerp.componentpricing.dto.MachineRoomResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.MachineRoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/machine-rooms")
@RequiredArgsConstructor
@Slf4j
public class MachineRoomController {

    private final MachineRoomService service;

    @PostMapping
    public ResponseEntity<ApiResponse<MachineRoomResponseDTO>> create(
            @Valid @RequestBody MachineRoomRequestDTO dto) {
        log.info("API Request: Create MachineRoom");
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MachineRoomResponseDTO>> update(
            @PathVariable int id,
            @Valid @RequestBody MachineRoomRequestDTO dto) {
        log.info("API Request: Update MachineRoom ID {}", id);
        return ResponseEntity.ok(service.update(id, dto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MachineRoomResponseDTO>>> getAll(
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        log.info("API Request: Get All MachineRooms");
        return ResponseEntity.ok(service.getAll(sortBy, direction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable int id) {
        log.info("API Request: Delete MachineRoom ID {}", id);
        return ResponseEntity.ok(service.delete(id));
    }
}
