package com.aibi.neerp.leadmanagement.inspectionreport.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aibi.neerp.leadmanagement.inspectionreport.dto.*;
import com.aibi.neerp.leadmanagement.inspectionreport.service.*;

@RestController
@RequestMapping("/api/inspection-checkpoint-status")
public class InspectionCheckpointStatusController {

    @Autowired
    private InspectionCheckpointStatusService statusService;

    /**
     * Create or Update Inspection Checkpoint Statuses
     * Handles insert, update, and delete operations
     */
    @PostMapping("/create-or-update")
    public ResponseEntity<String> createOrUpdateStatus(
            @RequestBody InspectionCheckpointStatusRequestDto requestDto) {

        String result = statusService.createOrUpdateInspectionCheckpointStatus(requestDto);
        return ResponseEntity.ok(result);
    }

    /**
     * Get all checkpoint statuses
     */
    @GetMapping("/getAllCheckPointsStatuses")
    public ResponseEntity<List<InspectionCheckpointStatusDto>> getAllStatuses() {

        List<InspectionCheckpointStatusDto> statuses = statusService.getAllStatuses();
        return ResponseEntity.ok(statuses);
    }

    /**
     * Get checkpoint status by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<InspectionCheckpointStatusDto> getStatusById(@PathVariable Integer id) {

        InspectionCheckpointStatusDto status = statusService.getStatusById(id);
        return ResponseEntity.ok(status);
    }

    /**
     * Delete checkpoint status by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStatus(@PathVariable Integer id) {

        statusService.deleteStatus(id);
        return ResponseEntity.ok("Checkpoint Status deleted successfully");
    }
}