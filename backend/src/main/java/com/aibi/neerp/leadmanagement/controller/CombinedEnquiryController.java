package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.dto.EnquiryGroupByTypeResponseDto;
import com.aibi.neerp.leadmanagement.dto.EnquiryRequestDto;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.service.CombinedEnquiryService;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/combined-enquiry")
public class CombinedEnquiryController {

    @Autowired
    private CombinedEnquiryService combinedEnquiryService;

    @GetMapping
    public ResponseEntity<CombinedEnquiry> getOrCreate(@RequestParam Integer leadId) {
        CombinedEnquiry combined = combinedEnquiryService.getOrCreateCombinedEnquiry(leadId);
        return ResponseEntity.ok(combined);
    }
    
    @GetMapping("/group-by-type")
    public ResponseEntity<List<EnquiryGroupByTypeResponseDto>> getEnquiriesGroupedByType(@RequestParam Integer leadId) {
        List<EnquiryGroupByTypeResponseDto> response = combinedEnquiryService.groupByTypeResponseDto(leadId);
        return ResponseEntity.ok(response);
    }

    
    @PostMapping("/{leadId}/create-combined-enquiries")
    public ResponseEntity<String> createCombinedEnquiries(
            @PathVariable Integer leadId,
            @RequestParam String projectName,
            @RequestParam Integer enquiryTypeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate enquiryDate,
            @RequestBody List<EnquiryRequestDto> enquiryDtos) {
    	
    	System.out.println("call apiu "+enquiryDate);

        combinedEnquiryService.createCombinedEnquiries(leadId, enquiryDtos, projectName, enquiryTypeId , enquiryDate);
        return ResponseEntity.ok("Combined Enquiry created successfully");
    }
    
    @PutMapping("/{leadId}/update-combined-enquiries")
    public ResponseEntity<String> updateCombinedEnquiries(
            @PathVariable Integer leadId,
            @RequestParam Integer combinedEnqId,
            @RequestParam String projectName,
            @RequestParam Integer enquiryTypeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate enquiryDate,
            @RequestBody List<EnquiryRequestDto> enquiryDtos) {
    	
    	System.out.println("call apiu "+leadId);

        combinedEnquiryService.updateCombinedEnquiries(combinedEnqId , leadId, enquiryDtos, projectName, enquiryTypeId,enquiryDate);
        return ResponseEntity.ok("Combined Enquiry Updated successfully");
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCombinedEnquiry(@PathVariable Integer id) {
        combinedEnquiryService.deleteCombinedEnquiryById(id);
        return ResponseEntity.ok("Combined Enquiry with ID " + id + " deleted successfully.");
    }

    
}
