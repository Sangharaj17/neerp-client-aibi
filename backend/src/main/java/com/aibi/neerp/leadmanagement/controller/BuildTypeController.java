package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.dto.BuildTypeDto;
import com.aibi.neerp.leadmanagement.service.BuildTypeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/build-types")
public class BuildTypeController {

    @Autowired
    private BuildTypeService buildTypeService;

    @GetMapping
    public ResponseEntity<List<BuildTypeDto>> getAll() {
        return ResponseEntity.ok(buildTypeService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuildTypeDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(buildTypeService.getById(id));
    }

    @PostMapping
    public ResponseEntity<BuildTypeDto> create(@Valid @RequestBody BuildTypeDto dto) {
        return ResponseEntity.ok(buildTypeService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BuildTypeDto> update(@PathVariable Integer id, @Valid @RequestBody BuildTypeDto dto) {
        return ResponseEntity.ok(buildTypeService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        buildTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
