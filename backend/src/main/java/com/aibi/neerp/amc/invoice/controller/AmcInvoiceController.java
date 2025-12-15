package com.aibi.neerp.amc.invoice.controller;


import com.aibi.neerp.amc.invoice.dto.AmcInvoiceCountsDto;
import com.aibi.neerp.amc.invoice.dto.AmcInvoicePdfData;
import com.aibi.neerp.amc.invoice.dto.AmcInvoiceRequestDto;
import com.aibi.neerp.amc.invoice.dto.AmcInvoiceResponseDto;
import com.aibi.neerp.amc.invoice.service.AmcInvoiceService;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/amc/invoices")
public class AmcInvoiceController {

    private static final Logger log = LoggerFactory.getLogger(AmcInvoiceController.class);

    private final AmcInvoiceService invoiceService;

    public AmcInvoiceController(AmcInvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    // API 1: GET All Invoices
    // Endpoint: GET /api/invoices
    @GetMapping("/getAllInvoices") // Changed from the bare @GetMapping
    public Page<AmcInvoiceResponseDto> getAllInvoices(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateSearch,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "invoiceDate") String sortBy, // Default sort by date
            @RequestParam(defaultValue = "desc") String direction // Default descending
    ) {
        log.info("Request received to fetch AMC Invoices with search='{}', date='{}'", search, dateSearch);
        
        // Call the refactored service method
        return invoiceService.getInvoicesPaged(search, dateSearch, page, size, sortBy, direction);
    }

// API 1a: GET All Pending Invoices (isCleared == 0)
@GetMapping("/getAllPendingInvoices")
public Page<AmcInvoiceResponseDto> getAllPendingInvoices(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateSearch,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "invoiceDate") String sortBy, 
        @RequestParam(defaultValue = "desc") String direction 
) {
    log.info("Request received to fetch Pending AMC Invoices with search='{}', date='{}'", search, dateSearch);
    
    return invoiceService.getPendingInvoicesPaged(search, dateSearch, page, size, sortBy, direction);
}    
 // API 2: GET Invoice Summary Counts (New Method)
    // Endpoint: GET /api/amc/invoices/counts
    @GetMapping("/counts")
    public AmcInvoiceCountsDto getInvoiceCounts() { // Use a specific DTO for clarity
        log.info("Request received to fetch AMC Invoice summary counts.");
        return invoiceService.getInvoiceSummaryCounts();
    }

    // API 2: GET Invoice by ID
    // Endpoint: GET /api/invoices/{id}
    @GetMapping("/{id}")
    public ResponseEntity<AmcInvoiceResponseDto> getInvoiceById(@PathVariable Integer id) {
        log.info("API Call: GET invoice by ID: {}", id);
        try {
            AmcInvoiceResponseDto dto = invoiceService.getInvoiceById(id);
            log.debug("API Status: Found invoice ID: {}", id);
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (RuntimeException e) {
            log.warn("API Status: Invoice not found for ID: {}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // API 3: POST Create New Invoice
    // Endpoint: POST /api/invoices
    @PostMapping
    public ResponseEntity<AmcInvoiceResponseDto> createInvoice(@RequestBody AmcInvoiceRequestDto requestDto) {
        log.info("API Call: POST create new invoice.");
        try {
            AmcInvoiceResponseDto savedDto = invoiceService.saveInvoice(requestDto);
            return new ResponseEntity<>(savedDto, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("API Error: Failed to create invoice.", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
 // Using a POST request as this method CREATES resources (invoices)
    @PostMapping("/createMultiple")
    public ResponseEntity<String> createMultipleInvoices(
            // Use @RequestParam for required IDs passed in the URL query string
            @RequestParam(required = false) Integer jobId, 
            @RequestParam(required = false) Integer renewalJobId) {
        
        log.info("API Call: POST to create multiple invoices for Job ID: {} and Renewal Job ID: {}", 
                 jobId, renewalJobId);
        
        // Input validation for the primary ID
        if (jobId == null) {
            return new ResponseEntity<>("Error: jobId must be provided.", HttpStatus.BAD_REQUEST);
        }
        
        // Call the service method
        String status = invoiceService.createMultipleInvoices(jobId, renewalJobId);
        
        // Return appropriate HTTP status based on the service result
        if ("success".equalsIgnoreCase(status)) {
            // 201 Created is often used for successful creation of resources
            return new ResponseEntity<>("Invoices created successfully.", HttpStatus.CREATED);
        } else {
            // 400 Bad Request or 500 Internal Server Error for failure
            return new ResponseEntity<>("Failed to create invoices. Reason: " + status, HttpStatus.BAD_REQUEST);
        }
    }

    // API 4: PUT Update Existing Invoice
    // Endpoint: PUT /api/invoices/{id}
    @PutMapping("/{id}")
    public ResponseEntity<AmcInvoiceResponseDto> updateInvoice(
            @PathVariable Integer id, 
            @RequestBody AmcInvoiceRequestDto requestDto) {
        
        log.info("API Call: PUT update invoice ID: {}", id);
        try {
            AmcInvoiceResponseDto updatedDto = invoiceService.updateInvoice(id, requestDto);
            return new ResponseEntity<>(updatedDto, HttpStatus.OK);
        } catch (RuntimeException e) {
            log.error("API Error: Update failed for invoice ID {}: {}", id, e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // API 5: DELETE Invoice by ID
    // Endpoint: DELETE /api/invoices/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteInvoice(@PathVariable Integer id) {
        log.info("API Call: DELETE invoice ID: {}", id);
        try {
            invoiceService.deleteInvoice(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } catch (RuntimeException e) {
            log.error("API Error: Delete failed for invoice ID {}: {}", id, e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        } catch (Exception e) {
            log.error("API Error: Unexpected error during deletion for invoice ID {}.", id, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }
    
    @GetMapping("/amc-pdf-data/{invoiceId}") // Maps GET requests to this URL
    public ResponseEntity<AmcInvoicePdfData> getAmcInvoicePdfData(@PathVariable Integer invoiceId) {

        // 1. Call the service method
        AmcInvoicePdfData data = invoiceService.amcInvoicePdfData(invoiceId);

        // 2. Return the data with an appropriate HTTP status (200 OK)
        if (data != null) {
            return ResponseEntity.ok(data);
        } else {
            // Optional: Return 404 Not Found if the data is null/not found
            return ResponseEntity.notFound().build();
        }
    }
    
    
    
    
}
