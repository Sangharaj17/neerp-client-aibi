package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.dto.LeadSourceDto;
import com.aibi.neerp.leadmanagement.service.LeadSourceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/lead-sources")
public class LeadSourceController {

    @Autowired
    private LeadSourceService leadSourceService;

    @GetMapping
    public ResponseEntity<List<LeadSourceDto>> getAllLeadSources() {
        return ResponseEntity.ok(leadSourceService.getAllLeadSources());
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<LeadSourceDto>> getLeadSourcesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(leadSourceService.getLeadSourcesPaginated(page, size, keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadSourceDto> getLeadSourceById(@PathVariable Integer id) {
        return ResponseEntity.ok(leadSourceService.getLeadSourceById(id));
    }

    @PostMapping
    public ResponseEntity<LeadSourceDto> createLeadSource(@Valid @RequestBody LeadSourceDto dto) {
        return ResponseEntity.ok(leadSourceService.createLeadSource(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadSourceDto> updateLeadSource(@PathVariable Integer id, @Valid @RequestBody LeadSourceDto dto) {
        return ResponseEntity.ok(leadSourceService.updateLeadSource(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeadSource(@PathVariable Integer id) {
        leadSourceService.deleteLeadSource(id);
        return ResponseEntity.noContent().build();
    }
}
