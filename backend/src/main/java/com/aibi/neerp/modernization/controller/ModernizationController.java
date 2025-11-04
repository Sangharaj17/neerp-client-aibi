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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aibi.neerp.amc.materialrepair.dto.MaterialRepairQuatationPdfData;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.modernization.dto.ModernizationQuotationInvoiceData;
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
    
    
    /**
     * Endpoint: PUT /api/modernization/update/{id}
     * Handles updating the main quotation and its details in a single transaction.
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateModernization(
        @PathVariable Integer id, 
        @RequestBody ModernizationRequestDto requestDto) 
    {
        try {
            // Call the service layer to execute the update logic
            ModernizationResponseDto updatedResponse = modernizationService.updateModernization(id, requestDto);
            
            // Return 200 OK with the updated data
            return ResponseEntity.ok(updatedResponse);

        } catch (ResourceNotFoundException e) {
            // Return 404 Not Found if the quotation ID does not exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                               .body(e.getMessage());
            
        } catch (Exception e) {
            // Return 500 Internal Server Error for any other failure (e.g., database error)
            // It's good practice to log the full exception here on the server side
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Failed to update modernization quotation: " + e.getMessage());
        }
    }
    
    @GetMapping("/getModernizationInvoiceData/{id}")
    public ResponseEntity<ModernizationQuotationInvoiceData> getModernizationInvoiceData(@PathVariable Integer id) {
        ModernizationQuotationInvoiceData data = modernizationService.getModernizationQuotationInvoiceData(id);
        return ResponseEntity.ok(data);
    }

    
    
}
