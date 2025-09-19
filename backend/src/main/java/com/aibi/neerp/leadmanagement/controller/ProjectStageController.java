package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.dto.ProjectStageDto;
import com.aibi.neerp.leadmanagement.service.ProjectStageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/project-stages")
public class ProjectStageController {

    @Autowired
    private ProjectStageService projectStageService;

    @GetMapping
    public ResponseEntity<List<ProjectStageDto>> getAll() {
        return ResponseEntity.ok(projectStageService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectStageDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(projectStageService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectStageDto> create(@Valid @RequestBody ProjectStageDto dto) {
        return ResponseEntity.ok(projectStageService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectStageDto> update(@PathVariable Integer id, @Valid @RequestBody ProjectStageDto dto) {
        return ResponseEntity.ok(projectStageService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        projectStageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
