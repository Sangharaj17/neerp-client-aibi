package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.CarDoorTypeRequestDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.CarDoorTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/car-door-types")
@RequiredArgsConstructor
@Slf4j
public class CarDoorTypeController {

    private final CarDoorTypeService service;

    @PostMapping
    //@PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<?> create(@Valid @RequestBody CarDoorTypeRequestDTO dto) {
        log.info("API called: Create Car Door Type");
        return new ApiResponse<>(true, "Created successfully", service.create(dto));
    }

    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<?> update( @PathVariable Integer id, @Valid @RequestBody CarDoorTypeRequestDTO dto) {
        log.info("API called: Update Car Door Type ID {}", id);
        return new ApiResponse<>(
                true, "Updated successfully", service.update(id, dto)
        );
    }


    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<?> delete(@PathVariable int id) {
        log.warn("API called: Delete Car Door Type ID {}", id);
        service.delete(id);
        return new ApiResponse<>(true, "Deleted successfully", null);
    }

    @GetMapping("/{id}")
    public ApiResponse<?> get(@PathVariable int id) {
        log.info("API called: Get Car Door Type ID {}", id);
        return new ApiResponse<>(true, "Fetched successfully", service.getById(id));
    }

    @GetMapping
    public ApiResponse<?> getAll(@RequestParam(defaultValue = "carDoorType") String sortBy) {
        log.info("API called: Get All Car Door Types");
        List<?> list = service.getAll(sortBy);
        return new ApiResponse<>(true, "Fetched all", list);
    }
}
