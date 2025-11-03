package com.aibi.neerp.modernization.controller;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aibi.neerp.modernization.dto.ModernizationRequestDto;
import com.aibi.neerp.modernization.dto.ModernizationRequestDtoPreData;
import com.aibi.neerp.modernization.dto.ModernizationResponseDto;
import com.aibi.neerp.modernization.service.ModernizationService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/modernization")
public class ModernizationController {

    private final ModernizationService modernizationService;

    // Constructor Injection is the preferred way
    public ModernizationController(ModernizationService modernizationService) {
        this.modernizationService = modernizationService;
    }

    /**
     * Endpoint to fetch pre-data for a modernization request.
     * Accessible via: GET /api/modernization/pre-data/{combinedEnqId}
     */
    @GetMapping("/pre-data/{combinedEnqId}")
    public ResponseEntity<?> getModernizationPreData(
            @PathVariable Integer combinedEnqId) {
        try {
            // Call the service method
            ModernizationRequestDtoPreData preData = 
                    modernizationService.getModernizationRequestDtoPreData(combinedEnqId);
            
            // Return the DTO with an HTTP 200 OK status
            return ResponseEntity.ok(preData);
            
        } catch (EntityNotFoundException e) {
            // If the CombinedEnquiry is not found, return an HTTP 404 Not Found
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(e.getMessage());
        } catch (Exception e) {
            // For any other unexpected errors, return an HTTP 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("An error occurred while fetching modernization pre-data: " + e.getMessage());
        }
    }
    
    
    @PostMapping("/create") // Maps to POST /api/modernization
    public ResponseEntity<ModernizationResponseDto> createModernizationQuotation(
            @RequestBody ModernizationRequestDto requestDto) {

        // 1. Call the service method
        ModernizationResponseDto responseDto = modernizationService.createModernization(requestDto);

        // 2. Return the response with HTTP Status 201 (Created)
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }
    
    
    // 🔹 GET ALL with Pagination, Sorting & Search
    @GetMapping("/getAll")
    public Page<ModernizationResponseDto> getAllModernizationQuotations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateSearch,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        
        return modernizationService.getAllModernizationQuotations(search, dateSearch, page, size, sortBy, direction);
    }
    
    @GetMapping("/getModernizationQuotationById/{id}")
    public ResponseEntity<ModernizationResponseDto> getModernizationQuotationById(@PathVariable Integer id) {
        ModernizationResponseDto response = modernizationService.getModernizationQuotationById(id);

        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/updateIsFinal/{id}")
    public ResponseEntity<String> updateIsFinalStatus(
            @PathVariable Integer id,
            @RequestParam Boolean isFinal) {

        boolean updated = modernizationService.updateIsFinalStatus(id, isFinal);

        if (updated) {
            return ResponseEntity.ok("Modernization quotation status updated successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    
    
}
