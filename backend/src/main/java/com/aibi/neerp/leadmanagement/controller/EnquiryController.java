package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.dto.CombinedEnquiryResponseDto;
import com.aibi.neerp.leadmanagement.dto.EnquiryGroupByTypeResponseDto;
import com.aibi.neerp.leadmanagement.dto.EnquiryRequestDto;
import com.aibi.neerp.leadmanagement.dto.EnquiryResponseDto;
import com.aibi.neerp.leadmanagement.service.EnquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/enquiries")
public class EnquiryController {

    @Autowired
    private EnquiryService enquiryService;

    @PostMapping
    public ResponseEntity<EnquiryResponseDto> create(@RequestBody EnquiryRequestDto dto) {
        return ResponseEntity.ok(enquiryService.create(dto));
    }
    
    @PostMapping("/createSubEnquiry")
    public ResponseEntity<EnquiryResponseDto> createCombinedSubEnquiry(
            @RequestParam Integer leadId,
            @RequestParam Integer combinedEnquiryId,
            @RequestParam String projectName,
            @RequestBody EnquiryRequestDto dto
    ) {
        return ResponseEntity.ok(enquiryService.createSubOrNewCombinedEnquiry(combinedEnquiryId , leadId, dto , projectName));
    }
    
    


    @GetMapping("/single")
    public ResponseEntity<List<EnquiryResponseDto>> getSingleEnquiriesByType(@RequestParam Integer enquiryTypeId) {
        return ResponseEntity.ok(enquiryService.getAllSingleEnquirys(enquiryTypeId));
    }

    
//    @GetMapping("/getAllCombinedEnquirys/by-lead/{leadId}")
//    public ResponseEntity<List<CombinedEnquiryResponseDto>> getAllCombinedEnquirysByLeadId(@PathVariable Integer leadId) {
//        return ResponseEntity.ok(enquiryService.getAllCombinedEnquiriesByLeadId(leadId));
//    }
    
    @GetMapping("/getAllCombinedEnquirys/by-lead/{leadId}")
    public ResponseEntity<List<CombinedEnquiryResponseDto>> getAllCombinedEnquirysByLeadIdAndEnquiryType(
            @PathVariable Integer leadId,
            @RequestParam(required = false) Integer enquiryTypeId) {
        return ResponseEntity.ok(enquiryService.getAllCombinedEnquiriesByLeadId(leadId, enquiryTypeId));
    }



    @GetMapping("/{id}")
    public ResponseEntity<EnquiryResponseDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(enquiryService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnquiryResponseDto> update(@PathVariable Integer id, @RequestBody EnquiryRequestDto dto) {
        return ResponseEntity.ok(enquiryService.updateEnquiry(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        enquiryService.delete(id);
        return ResponseEntity.ok("Enquiry deleted successfully.");
    }

    @GetMapping("/{leadId}/{enquiryId}")
    public ResponseEntity<List<EnquiryResponseDto>> getEnquiriesByLeadAndEnquiry(
            @PathVariable Integer leadId,
            @PathVariable Integer enquiryId) {

        List<EnquiryResponseDto> responses = enquiryService.getEnquiriesByLeadAndEnquiry(leadId, enquiryId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/missing-lifts")
    public ResponseEntity<List<EnquiryResponseDto>> getMissingLifts(
            @RequestParam Integer leadId,
            @RequestParam Integer combinedEnquiryId) {
        List<EnquiryResponseDto> existingLifts =
                enquiryService.getMissingLiftsForQuotation(leadId, combinedEnquiryId);

        return ResponseEntity.ok(existingLifts);
    }

}
