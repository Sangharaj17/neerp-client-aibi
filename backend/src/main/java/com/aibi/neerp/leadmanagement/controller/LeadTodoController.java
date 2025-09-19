package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.common.dto.PaginatedResponse;
import com.aibi.neerp.leadmanagement.dto.LeadTodoRequestDto;
import com.aibi.neerp.leadmanagement.dto.LeadTodoResponseDto;
import com.aibi.neerp.leadmanagement.service.LeadTodoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/lead-todos")
public class LeadTodoController {

    @Autowired
    private LeadTodoService leadTodoService;

    @PostMapping
    public ResponseEntity<LeadTodoResponseDto> create(@RequestBody LeadTodoRequestDto dto) {
        return ResponseEntity.ok(leadTodoService.create(dto));
    }
    
    @GetMapping
    public ResponseEntity<PaginatedResponse<LeadTodoResponseDto>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(leadTodoService.getAll(search, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadTodoResponseDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(leadTodoService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadTodoResponseDto> update(@PathVariable Integer id, @RequestBody LeadTodoRequestDto dto) {
        return ResponseEntity.ok(leadTodoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        leadTodoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/by-lead/{leadId}")
    public ResponseEntity<List<LeadTodoResponseDto>> getAllByLeadId(@PathVariable Integer leadId) {
        return ResponseEntity.ok(leadTodoService.getAllByLeadId(leadId));
    }

}
