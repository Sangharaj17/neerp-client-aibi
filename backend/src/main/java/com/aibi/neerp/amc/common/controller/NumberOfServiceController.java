package com.aibi.neerp.amc.common.controller;

import com.aibi.neerp.amc.common.dto.NumberOfServiceDto;
import com.aibi.neerp.amc.common.service.NumberOfServiceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amc/common/number-of-services")
public class NumberOfServiceController {

    private final NumberOfServiceService service;

    public NumberOfServiceController(NumberOfServiceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<NumberOfServiceDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NumberOfServiceDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<NumberOfServiceDto> create(@Valid @RequestBody NumberOfServiceDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NumberOfServiceDto> update(@PathVariable Long id, @Valid @RequestBody NumberOfServiceDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
