package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.CabinTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.CabinTypeResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.CabinTypeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cabinType")
public class CabinTypeController {

    @Autowired
    private CabinTypeService cabinTypeService;

    // Create
    @PostMapping
    public ApiResponse<CabinTypeResponseDTO> create(@Valid @RequestBody CabinTypeRequestDTO dto) {
        CabinTypeResponseDTO created = cabinTypeService.create(dto);
        return new ApiResponse<>(true, "Cabin Type created successfully", created);
    }

    // Get all
    @GetMapping
    public List<CabinTypeResponseDTO> findAll() {
        return cabinTypeService.findAll();
    }

    // Get by ID
    @GetMapping("/{id}")
    public ApiResponse<CabinTypeResponseDTO> findById(@PathVariable int id) {
        CabinTypeResponseDTO cabinType = cabinTypeService.findById(id);
        return new ApiResponse<>(true, "Cabin Type fetched successfully", cabinType);
    }

    // Update
    @PutMapping("/{id}")
    public ApiResponse<CabinTypeResponseDTO> update(@PathVariable int id, @Valid @RequestBody CabinTypeRequestDTO dto) {
        CabinTypeResponseDTO updated = cabinTypeService.update(id, dto);
        return new ApiResponse<>(true, "Cabin Type updated successfully", updated);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteById(@PathVariable int id) {
        cabinTypeService.deleteById(id);
        return new ApiResponse<>(true, "Cabin Type deleted successfully with ID: " + id, null);
    }
}
