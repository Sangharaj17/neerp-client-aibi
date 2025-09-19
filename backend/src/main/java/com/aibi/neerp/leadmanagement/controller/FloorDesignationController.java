package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.dto.FloorDesignationDto;
import com.aibi.neerp.leadmanagement.service.FloorDesignationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/floor-designations")
public class FloorDesignationController {

    @Autowired
    private FloorDesignationService floorDesignationService;

    @GetMapping
    public ResponseEntity<List<FloorDesignationDto>> getAll() {
        return ResponseEntity.ok(floorDesignationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FloorDesignationDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(floorDesignationService.getById(id));
    }

    @PostMapping
    public ResponseEntity<FloorDesignationDto> create(@Valid @RequestBody FloorDesignationDto dto) {
        return ResponseEntity.ok(floorDesignationService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FloorDesignationDto> update(@PathVariable Integer id, @Valid @RequestBody FloorDesignationDto dto) {
        return ResponseEntity.ok(floorDesignationService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        floorDesignationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
