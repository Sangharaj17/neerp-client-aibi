package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.dto.AreaDto;
import com.aibi.neerp.leadmanagement.service.AreaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/areas")
public class AreaController {

    @Autowired
    private AreaService areaService;

    @GetMapping
    public ResponseEntity<List<AreaDto>> getAll() {
        return ResponseEntity.ok(areaService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AreaDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(areaService.getById(id));
    }

    @PostMapping
    public ResponseEntity<AreaDto> create(@Valid @RequestBody AreaDto dto) {
        return ResponseEntity.ok(areaService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AreaDto> update(@PathVariable Integer id, @Valid @RequestBody AreaDto dto) {
        return ResponseEntity.ok(areaService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        areaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
