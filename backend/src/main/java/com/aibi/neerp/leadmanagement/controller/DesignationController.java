package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.dto.DesignationDto;
import com.aibi.neerp.leadmanagement.service.DesignationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/designations")
public class DesignationController {

    @Autowired
    private DesignationService designationService;

    @GetMapping
    public ResponseEntity<List<DesignationDto>> getAll() {
        return ResponseEntity.ok(designationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DesignationDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(designationService.getById(id));
    }

    @PostMapping
    public ResponseEntity<DesignationDto> create(@Valid @RequestBody DesignationDto dto) {
        return ResponseEntity.ok(designationService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DesignationDto> update(@PathVariable Integer id, @Valid @RequestBody DesignationDto dto) {
        return ResponseEntity.ok(designationService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        designationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
