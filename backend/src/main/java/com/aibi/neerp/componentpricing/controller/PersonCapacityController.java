// File: PersonCapacityController.java
package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.PersonCapRequestDTO;
import com.aibi.neerp.componentpricing.dto.PersonCapResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.PersonCapacityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personCapacity")
@RequiredArgsConstructor
public class PersonCapacityController {

    private final PersonCapacityService service;

    @PostMapping
    public ResponseEntity<ApiResponse<PersonCapResponseDTO>> create(@RequestBody PersonCapRequestDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PersonCapResponseDTO>>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PersonCapResponseDTO>> update(@PathVariable Integer id, @RequestBody PersonCapRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        return ResponseEntity.ok(service.delete(id));
    }
}
