package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.dto.LeadStageDto;
import com.aibi.neerp.leadmanagement.service.LeadStageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/lead-stages")
public class LeadStageController {

    @Autowired
    private LeadStageService leadStageService;

    @GetMapping
    public ResponseEntity<List<LeadStageDto>> getAll() {
        return ResponseEntity.ok(leadStageService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadStageDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(leadStageService.getById(id));
    }

    @PostMapping
    public ResponseEntity<LeadStageDto> create(@Valid @RequestBody LeadStageDto dto) {
        return ResponseEntity.ok(leadStageService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadStageDto> update(@PathVariable Integer id, @Valid @RequestBody LeadStageDto dto) {
        return ResponseEntity.ok(leadStageService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        leadStageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
