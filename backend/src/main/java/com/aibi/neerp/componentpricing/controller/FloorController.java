package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.FloorRequestDTO;
import com.aibi.neerp.componentpricing.dto.FloorResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.FloorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/floors")
@RequiredArgsConstructor
@Slf4j
public class FloorController {

    private final FloorService floorService;

    /** CREATE - Generate Multiple Floors */
    @PostMapping("/generate")
    public ApiResponse<List<FloorResponseDTO>> generateFloors(@Valid @RequestBody FloorRequestDTO requestDTO) {
        log.info("Request to generate floors: {}", requestDTO);
        return floorService.generateAndSaveFloors(requestDTO);
    }

    /** READ - Get All Floors (Sorted) */
    @GetMapping
    public ApiResponse<List<FloorResponseDTO>> getAllFloors() {
        log.info("Fetching all floors");
        return floorService.getAllFloorsSorted();
    }

    /** READ - Get Floor By ID */
    @GetMapping("/{id}")
    public ApiResponse<FloorResponseDTO> getFloorById(@PathVariable Long id) {
        log.info("Fetching floor with ID {}", id);
        return floorService.getFloorById(id);
    }

    /** UPDATE - Update Floor Name */
    @PutMapping("/{id}")
    public ApiResponse<FloorResponseDTO> updateFloor(@PathVariable Long id,
                                                     @RequestParam String newName) {
        log.info("Updating floor ID {} to '{}'", id, newName);
        return floorService.updateFloor(id, newName);
    }

    /** DELETE - Delete Floor By ID */
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteFloor(@PathVariable Long id) {
        log.info("Deleting floor ID {}", id);
        return floorService.deleteFloor(id);
    }
}
