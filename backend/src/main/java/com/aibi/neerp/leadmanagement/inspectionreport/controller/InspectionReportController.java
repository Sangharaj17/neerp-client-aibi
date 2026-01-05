package com.aibi.neerp.leadmanagement.inspectionreport.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionCheckpointStatusDto;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionReportAndRepeatLiftsWrapperDto;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionReportCategoryAndCheckpointsDto;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionReportForAddLiftsDatas;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionReportRequestDto;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionReportViewAndPdfData;
import com.aibi.neerp.leadmanagement.inspectionreport.service.InspectionCheckpointStatusService;
import com.aibi.neerp.leadmanagement.inspectionreport.service.InspectionReportCategoryAndCheckpointsService;
import com.aibi.neerp.leadmanagement.inspectionreport.service.InspectionReportService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inspection-report")
public class InspectionReportController {

    @Autowired
    private InspectionReportService inspectionReportService;
    @Autowired
    private InspectionCheckpointStatusService statusService;
    @Autowired
    private InspectionReportCategoryAndCheckpointsService categoryAndCheckpointsService;


    /**
     * Create or Update inspection report with repeat lifts
     * 
     * @param inspectionReportId (optional) – null for create, id for update
     * @param combinedEnquiryId – required for creating new report
     */
    @PostMapping("/save")
    public ResponseEntity<?> createOrUpdateInspectionReport(
            @RequestParam(required = false) Integer inspectionReportId,
            @RequestParam(required = false) Integer combinedEnquiryId,
            @RequestBody InspectionReportRequestDto requestDto) {

        try {
            String result = inspectionReportService.createOrUpdateInspectionReport(
                    inspectionReportId,
                    combinedEnquiryId,
                    requestDto
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


    /**
     * Fetch inspection report data for editing
     * 
     * @param inspectionReportsId – ID of inspection_reports table
     */
    @GetMapping("/edit/{inspectionReportsId}")
    public ResponseEntity<?> getInspectionReportEditData(
            @PathVariable Integer inspectionReportsId) {

        try {
            List<InspectionReportAndRepeatLiftsWrapperDto> data =
                    inspectionReportService.getInspectionReportEditData(inspectionReportsId);

            return ResponseEntity.ok(data);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    /**
     * Get all checkpoint statuses
     */
    @GetMapping("/getAllCheckPointsStatuses")
    public ResponseEntity<List<InspectionCheckpointStatusDto>> getAllStatuses() {

        List<InspectionCheckpointStatusDto> statuses = statusService.getAllStatuses();
        return ResponseEntity.ok(statuses);
    }
    
    @GetMapping("/categories-with-checkpoints")
    public ResponseEntity<?> getInspectionReportCategoriesWithCheckpoints() {

        try {
            List<InspectionReportCategoryAndCheckpointsDto> data =
            		categoryAndCheckpointsService.inspectionReportCategoryAndCheckpointsDtos();

            return ResponseEntity.ok(data);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/add-lifts-data/{combinedEnqId}")
    public ResponseEntity<?> getInspectionReportForAddLiftsDatas(
            @PathVariable Integer combinedEnqId) {

        try {
            InspectionReportForAddLiftsDatas data =
                    inspectionReportService.getInspectionReportForAddLiftsDatas(combinedEnqId);

            return ResponseEntity.ok(data);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    /**
     * Get list of all inspection reports for a combined enquiry
     * 
     * @param combinedEnquiryId ID of the combined enquiry
     * @return List of inspection reports with id and reportEdition
     */
    @GetMapping("/list/{combinedEnquiryId}")
    public ResponseEntity<?> getInspectionReportsList(@PathVariable Integer combinedEnquiryId) {
        try {
            List<Map<String, Object>> reports = inspectionReportService.getInspectionReportsList(combinedEnquiryId);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
//    @GetMapping("/{reportId}/view-pdf-data")
//    public ResponseEntity<List<InspectionReportViewAndPdfData>> 
//        getInspectionReportViewAndPdfData(
//            @PathVariable Integer reportId) {
//
//        List<InspectionReportViewAndPdfData> response =
//                inspectionReportService
//                        .getInspectionReportViewAndPdfDataByReportId(reportId);
//
//        return ResponseEntity.ok(response);
//    }
    
    @GetMapping("/{reportId}/view-pdf-data")
    public ResponseEntity<?> getInspectionReportViewAndPdfData(
            @PathVariable Integer reportId) {

        try {

            List<InspectionReportViewAndPdfData> response =
                    inspectionReportService
                            .getInspectionReportViewAndPdfDataByReportId(reportId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }


    
}
