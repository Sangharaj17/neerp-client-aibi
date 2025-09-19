package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.CapacityTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.CapacityTypeResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.CapacityTypeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/capacityTypes")
@CrossOrigin(origins = "*")
public class CapacityTypeController {

    @Autowired
    private CapacityTypeService service;

    @PostMapping
    public ApiResponse<CapacityTypeResponseDTO> create(@Valid @RequestBody CapacityTypeRequestDTO dto) {
        CapacityTypeResponseDTO saved = service.create(dto);
        return new ApiResponse<>(true, "Capacity type created successfully", saved);
    }

    @GetMapping
    public ApiResponse<List<CapacityTypeResponseDTO>> getAll() {
        List<CapacityTypeResponseDTO> list = service.findAll();
        return new ApiResponse<>(true, "Capacity types fetched successfully", list);
    }

    @PutMapping("/{id}")
    public ApiResponse<CapacityTypeResponseDTO> update(@PathVariable Integer id,
                                                       @Valid @RequestBody CapacityTypeRequestDTO dto) {
        CapacityTypeResponseDTO updated = service.update(id, dto);
        return new ApiResponse<>(true, "Capacity type updated successfully", updated);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(true, "Capacity type deleted successfully", null);
    }
}
