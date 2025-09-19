package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.CarDoorSubTypeRequestDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.CarDoorSubTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/car-door-subTypes")
@RequiredArgsConstructor
@Slf4j
public class CarDoorSubTypeController {

    private final CarDoorSubTypeService service;

    @PostMapping
    public ApiResponse<?> create(@Valid @RequestBody CarDoorSubTypeRequestDTO dto) {
        log.info("API: Create CarDoorSubType");
        return new ApiResponse<>(true, "Created successfully", service.create(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<?> update(@PathVariable Integer id, @Valid @RequestBody CarDoorSubTypeRequestDTO dto) {
        log.info("API: Update CarDoorSubType ID {}",id);
        return new ApiResponse<>(true, "Updated successfully", service.update(id, dto));
    }


    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable int id) {
        log.warn("API: Delete CarDoorSubType ID {}", id);
        service.delete(id);
        return new ApiResponse<>(true, "Deleted successfully", null);
    }

    @GetMapping("/{id}")
    public ApiResponse<?> get(@PathVariable int id) {
        log.info("API: Get CarDoorSubType ID {}", id);
        return new ApiResponse<>(true, "Fetched successfully", service.getById(id));
    }

    @GetMapping
    public ApiResponse<?> getAll(@RequestParam(defaultValue = "carDoorSubtype") String sortBy) {
        log.info("API: Get All CarDoorSubTypes");
        return new ApiResponse<>(true, "Fetched all", service.getAll(sortBy));
    }
}
