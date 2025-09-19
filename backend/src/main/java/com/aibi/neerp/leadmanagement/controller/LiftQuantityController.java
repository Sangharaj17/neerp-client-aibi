package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.dto.LiftQuantityDto;
import com.aibi.neerp.leadmanagement.service.LiftQuantityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/lift-quantities")
public class LiftQuantityController {

    @Autowired
    private LiftQuantityService liftQuantityService;

    @GetMapping
    public ResponseEntity<List<LiftQuantityDto>> getAll() {
        return ResponseEntity.ok(liftQuantityService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LiftQuantityDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(liftQuantityService.getById(id));
    }

    @PostMapping
    public ResponseEntity<LiftQuantityDto> create(@Valid @RequestBody LiftQuantityDto dto) {
        return ResponseEntity.ok(liftQuantityService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LiftQuantityDto> update(@PathVariable Integer id, @Valid @RequestBody LiftQuantityDto dto) {
        return ResponseEntity.ok(liftQuantityService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        liftQuantityService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
