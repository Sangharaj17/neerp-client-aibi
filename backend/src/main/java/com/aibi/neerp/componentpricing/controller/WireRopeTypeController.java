package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.WireRopeTypeRequestDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.WireRopeTypeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api/wire-rope-types")
@RequiredArgsConstructor
public class WireRopeTypeController {

    private final WireRopeTypeService wireRopeTypeService;

    // @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createWireRopeType(@Valid @RequestBody WireRopeTypeRequestDTO dto) {
        log.info("Request to create Wire Rope Type: {}", dto);
        return ResponseEntity.ok(wireRopeTypeService.createWireRopeType(dto));
    }

    // @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllWireRopeTypes(@RequestParam(required = false) String sortBy) {
        log.info("Fetching all Wire Rope Types sorted by {}", sortBy);
        return ResponseEntity.ok(wireRopeTypeService.getAllWireRopeTypes(sortBy));
    }

    // @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateWireRopeType(
            @PathVariable Long id,
            @Valid @RequestBody WireRopeTypeRequestDTO dto
    ) {
        log.info("Request to update Wire Rope Type ID: {}", id);
        return ResponseEntity.ok(wireRopeTypeService.updateWireRopeType(id, dto));
    }

    // @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteWireRopeType(@PathVariable Long id) {
        log.info("Request to delete Wire Rope Type ID: {}", id);
        return ResponseEntity.ok(wireRopeTypeService.deleteWireRopeType(id));
    }
}
