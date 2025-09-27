package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.CounterWeightTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.CounterWeightTypeResponseDTO;
import com.aibi.neerp.componentpricing.service.CounterWeightTypeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/counter-weights-types")
@RequiredArgsConstructor
@Slf4j
public class CounterWeightTypeController {

    private final CounterWeightTypeService service;

    @PostMapping
    public ResponseEntity<CounterWeightTypeResponseDTO> create(@Valid @RequestBody CounterWeightTypeRequestDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<CounterWeightTypeResponseDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CounterWeightTypeResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CounterWeightTypeResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody CounterWeightTypeRequestDTO dto
    ) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Deleted Counter Weight Type with ID " + id);
    }
}