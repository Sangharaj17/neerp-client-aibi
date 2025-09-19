package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.dto.CabinCeilingRequestDTO;
import com.aibi.neerp.componentpricing.dto.CabinCeilingResponseDTO;
import com.aibi.neerp.componentpricing.service.CabinCeilingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cabin-ceiling")
@RequiredArgsConstructor
@Slf4j
public class CabinCeilingController {

    private final CabinCeilingService ceilingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CabinCeilingResponseDTO>>> getAll() {
        log.info("GET request - get all cabin ceilings");
        List<CabinCeilingResponseDTO> data = ceilingService.getAllCeilings();
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched successfully", data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CabinCeilingResponseDTO>> getById(@PathVariable Integer id) {
        log.info("GET request - get cabin ceiling by ID: {}", id);
        CabinCeilingResponseDTO data = ceilingService.getCeilingById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched successfully", data));
    }

    @PostMapping
    //@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<CabinCeilingResponseDTO>> create(@Valid @RequestBody CabinCeilingRequestDTO request) {
        log.info("POST request - create new cabin ceiling");
        CabinCeilingResponseDTO data = ceilingService.createCeiling(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Created successfully", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CabinCeilingResponseDTO>> update(
            @PathVariable Integer id,
            @Valid @RequestBody CabinCeilingRequestDTO request) {
        log.info("PUT request - update cabin ceiling ID: {}", id);
        CabinCeilingResponseDTO data = ceilingService.updateCeiling(id, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Updated successfully", data));
    }


    @DeleteMapping("/{id}")
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        log.info("DELETE request - cabin ceiling ID: {}", id);
        ceilingService.deleteCeiling(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Deleted successfully", null));
    }
}
