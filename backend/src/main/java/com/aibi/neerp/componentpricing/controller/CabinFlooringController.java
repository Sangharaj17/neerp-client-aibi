package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.CabinFlooringRequestDTO;
import com.aibi.neerp.componentpricing.dto.CabinFlooringResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.CabinFlooringService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cabin-flooring")
@RequiredArgsConstructor
@Slf4j
public class CabinFlooringController {

    private final CabinFlooringService service;

    //@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_FLOORING')")
    @PostMapping
    public ResponseEntity<ApiResponse<CabinFlooringResponseDTO>> create(@Valid @RequestBody CabinFlooringRequestDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    //@PreAuthorize("hasRole('ADMIN') or hasAuthority('MANAGE_FLOORING')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CabinFlooringResponseDTO>> update(
            @PathVariable Integer id,
            @Valid @RequestBody CabinFlooringRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    //@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CabinFlooringResponseDTO>>> getAllSorted() {
        return ResponseEntity.ok(service.findAllSorted());
    }

    //@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CabinFlooringResponseDTO>> getById(@PathVariable int id) {
        return ResponseEntity.ok(service.findById(id));
    }

    //@PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable int id) {
        return ResponseEntity.ok(service.delete(id));
    }
}
