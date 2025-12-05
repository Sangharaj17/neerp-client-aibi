package com.aibi.neerp.leadmanagement.inspectionreport.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionReportCategoryAndCheckpointsDto;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionReportCategoryAndCheckpointsRequestDto;
import com.aibi.neerp.leadmanagement.inspectionreport.service.InspectionReportCategoryAndCheckpointsService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/inspection-report/categories")
@Slf4j
public class InspectionReportCategoryAndCheckpointsController {

    @Autowired
    private InspectionReportCategoryAndCheckpointsService service;

    /**
     * Creates or updates categories & checkpoints
     *
     * @author Sachin
     */
    @PostMapping("/create-or-update")
    public ResponseEntity<?> createOrUpdate(
            @RequestBody InspectionReportCategoryAndCheckpointsRequestDto requestDto) {

        log.info("API: Create/Update Inspection Categories & Checkpoints");

        try {
            String status = service.createOrUpdateInspectionCategoriesAndHisCheckpoints(requestDto);
            return ResponseEntity.ok(status);

        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (RuntimeException e) {
            log.error("Runtime error: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(e.getMessage());

        } catch (Exception e) {
            log.error("Unexpected error: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Something went wrong.");
        }
    }

    /**
     * Deletes a category (and its child checkpoints)
     * 
     * @author Sachin
     */
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer categoryId) {

        log.info("API: Delete Category ID = {}", categoryId);

        try {
            service.deleteInspectionReportCategory(categoryId);
            return ResponseEntity.ok("Category deleted successfully.");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Could not delete category.");
        }
    }

    /**
     * Deletes a single checkpoint
     * 
     * @author Sachin
     */
    @DeleteMapping("/checkpoint/{checkpointId}")
    public ResponseEntity<?> deleteCheckpoint(@PathVariable Integer checkpointId) {

        log.info("API: Delete Checkpoint ID = {}", checkpointId);

        try {
            service.deleteInspectionReportCategoryCheckpoint(checkpointId);
            return ResponseEntity.ok("Checkpoint deleted successfully.");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Could not delete checkpoint.");
        }
    }
    
    @GetMapping("/categories-with-checkpoints")
    public ResponseEntity<?> getInspectionReportCategoriesWithCheckpoints() {

        try {
            List<InspectionReportCategoryAndCheckpointsDto> data =
            		service.inspectionReportCategoryAndCheckpointsDtos();

            return ResponseEntity.ok(data);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


}
