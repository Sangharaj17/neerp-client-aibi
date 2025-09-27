package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.CapacityDimensionsRequestDTO;
import com.aibi.neerp.componentpricing.dto.CapacityDimensionsResponseDTO;
import com.aibi.neerp.componentpricing.service.CapacityDimensionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/capacity-dimensions")
@RequiredArgsConstructor
public class CapacityDimensionsController {

    private final CapacityDimensionsService service;

    // 🔹 Get All
    @GetMapping
    public List<CapacityDimensionsResponseDTO> getAll() {
        return service.getAllCapacityDimensions();
    }

    // 🔹 Get by ID
    @GetMapping("/{id}")
    public CapacityDimensionsResponseDTO getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // 🔹 Create
    @PostMapping
    public CapacityDimensionsResponseDTO create(@RequestBody CapacityDimensionsRequestDTO request) {
        return service.create(request);
    }

    // 🔹 Update
    @PutMapping("/{id}")
    public CapacityDimensionsResponseDTO update(@PathVariable Integer id,
                                                @RequestBody CapacityDimensionsRequestDTO request) {
        return service.update(id, request);
    }

    // 🔹 Delete
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    // 🔹 Search by Capacity (⏩ New endpoint for your frontend fetch)
    @GetMapping("/searchByCapacity")
    public ResponseEntity<CapacityDimensionsResponseDTO> searchByCapacity(
            @RequestParam Integer capacityTypeId,
            @RequestParam Integer capacityValueId) {
        CapacityDimensionsResponseDTO result = service.findByCapacity(capacityTypeId, capacityValueId);
        return ResponseEntity.ok(result);
    }
}
