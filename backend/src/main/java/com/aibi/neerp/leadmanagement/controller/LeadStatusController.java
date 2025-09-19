package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.dto.LeadStatusDto;
import com.aibi.neerp.leadmanagement.service.LeadStatusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/lead-status")
@RequiredArgsConstructor
public class LeadStatusController {

    private final LeadStatusService leadStatusService;

    @PostMapping
    public ResponseEntity<LeadStatusDto> create(@Valid @RequestBody LeadStatusDto dto) {
        return ResponseEntity.ok(leadStatusService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadStatusDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(leadStatusService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<LeadStatusDto>> getAll() {
        return ResponseEntity.ok(leadStatusService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadStatusDto> update(@PathVariable Integer id,
                                                @Valid @RequestBody LeadStatusDto dto) {
        return ResponseEntity.ok(leadStatusService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        leadStatusService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
