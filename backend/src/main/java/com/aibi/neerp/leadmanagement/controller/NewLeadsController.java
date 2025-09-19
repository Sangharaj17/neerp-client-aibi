package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.common.dto.PaginatedResponse;
import com.aibi.neerp.leadmanagement.dto.NewLeadsRequestDto;
import com.aibi.neerp.leadmanagement.dto.NewLeadsResponseDto;
import com.aibi.neerp.leadmanagement.service.NewLeadsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/leads")
public class NewLeadsController {

    @Autowired
    private NewLeadsService newLeadsService;

    @PostMapping
    public ResponseEntity<NewLeadsResponseDto> create( @RequestBody NewLeadsRequestDto dto) {
    	
    	System.out.println("callled success "+dto.getLandlineNo());
        return ResponseEntity.ok(newLeadsService.createLead(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<NewLeadsResponseDto> updateLead(
            @PathVariable Integer id,
            @RequestBody NewLeadsRequestDto dto) {
        return ResponseEntity.ok(newLeadsService.updateLead(id, dto));
    }


    @GetMapping
    public ResponseEntity<PaginatedResponse<NewLeadsResponseDto>> getAllLeads(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
    	
    	System.out.println("call getAllLeads");
        return ResponseEntity.ok(newLeadsService.getAllLeads(search, page, size));
    }


    @GetMapping("/{id}")
    public ResponseEntity<NewLeadsResponseDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(newLeadsService.getLeadById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        newLeadsService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{leadId}/stage")
    public ResponseEntity<NewLeadsResponseDto> updateLeadStage(
            @PathVariable Integer leadId,
            @RequestParam Integer stageId) {

        return ResponseEntity.ok(newLeadsService.updateLeadStage(leadId, stageId));
    }
    
    @PutMapping("/{leadId}/updateProjectStage")
    public ResponseEntity<NewLeadsResponseDto> updateLeadProjectStage(
            @PathVariable Integer leadId,
            @RequestParam Integer projectStageId) {

        return ResponseEntity.ok(newLeadsService.updateLeadProjectStage(leadId, projectStageId));
    } 
    
    @PutMapping("/{leadId}/updateStatus")
    public ResponseEntity<NewLeadsResponseDto> updateLeadStatus(
            @PathVariable Integer leadId,
            @RequestParam Integer statusId) {
        return ResponseEntity.ok(newLeadsService.updateLeadStatus(leadId, statusId));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<NewLeadsResponseDto>> getFilteredLeads() {
        System.out.println(newLeadsService.getFilteredLeads());
        return ResponseEntity.ok(newLeadsService.getFilteredLeads());
    }

}
