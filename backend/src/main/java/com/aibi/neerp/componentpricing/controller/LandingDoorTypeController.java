package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.LandingDoorTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.LandingDoorTypeResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.LandingDoorTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/landing-door-type")
@RequiredArgsConstructor
@Slf4j
public class LandingDoorTypeController {

    private final LandingDoorTypeService service;

    @PostMapping
    public ApiResponse<LandingDoorTypeResponseDTO> create(@Valid @RequestBody LandingDoorTypeRequestDTO dto) {
        LandingDoorTypeResponseDTO response = service.create(dto);
        return new ApiResponse<>(true, "Landing Door Type created successfully", response);
    }

    @PutMapping("/{id}")
    public ApiResponse<LandingDoorTypeResponseDTO> update(
            @PathVariable int id,
            @Valid @RequestBody LandingDoorTypeRequestDTO dto) {
        LandingDoorTypeResponseDTO response = service.update(id, dto);
        return new ApiResponse<>(true, "Landing Door Type updated successfully", response);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable int id) {
        service.delete(id);
        return new ApiResponse<>(true, "Landing Door Type deleted successfully", null);
    }

    @GetMapping("/{id}")
    public ApiResponse<LandingDoorTypeResponseDTO> get(@PathVariable int id) {
        LandingDoorTypeResponseDTO response = service.getById(id);
        return new ApiResponse<>(true, "Landing Door Type fetched successfully", response);
    }

    @GetMapping
    public ApiResponse<List<LandingDoorTypeResponseDTO>> getAll() {
        List<LandingDoorTypeResponseDTO> response = service.getAll();
        return new ApiResponse<>(true, "Landing Door Types fetched successfully", response);
    }

    @GetMapping("/by-operator/{operatorTypeId}")
    public ApiResponse<List<LandingDoorTypeResponseDTO>> getByOperatorType(@PathVariable int operatorTypeId) {
        List<LandingDoorTypeResponseDTO> response = service.getByOperatorTypeId(operatorTypeId);
        return new ApiResponse<>(true, "Landing Door Types fetched for given Operator", response);
    }
}
