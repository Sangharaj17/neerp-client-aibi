package com.aibi.neerp.oncall.controller;

import com.aibi.neerp.modernization.dto.ModernizatationQuotationPdfData;
import com.aibi.neerp.oncall.dto.OncallQuotationInvoiceData;
import com.aibi.neerp.oncall.dto.OncallQuotationPdfData;
import com.aibi.neerp.oncall.dto.OncallRequestDto;
import com.aibi.neerp.oncall.dto.OncallRequestDtoPreData;
import com.aibi.neerp.oncall.dto.OncallResponseDto;
import com.aibi.neerp.oncall.service.OncallService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/oncall")
@RequiredArgsConstructor
public class OncallController {

    private final OncallService oncallService;

    // --- CREATE OnCall Quotation ---
    @PostMapping
    public ResponseEntity<OncallResponseDto> createOnCallQuotation(@RequestBody OncallRequestDto requestDto) {
        OncallResponseDto response = oncallService.createOnCallQuotation(requestDto);
        return ResponseEntity.ok(response);
    }

 // --- UPDATE OnCall Quotation (Using a more RESTful path: /api/oncall/{id}) ---
    // Maps to: PUT /api/oncall/{id}
    @PutMapping("/{id}") // Simplified path for the UPDATE operation
    public ResponseEntity<OncallResponseDto> updateOnCallQuotation(
            @PathVariable Integer id,
            @RequestBody OncallRequestDto requestDto // Corrected DTO name to be consistent
    ) {
        // The service method name is adapted to match your original
        OncallResponseDto response = oncallService.updateOnCallQuotation(id, requestDto);
        return ResponseEntity.ok(response);
    }

    // --- GET ALL OnCall Quotations (with search, sort, pagination) ---
    @GetMapping
    public ResponseEntity<Page<OncallResponseDto>> getAllOnCallQuotations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateSearch,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Page<OncallResponseDto> result = oncallService.getAllOnCallQuotations(search, dateSearch, page, size, sortBy, direction);
        return ResponseEntity.ok(result);
    }

    // --- GET OnCall Quotation by ID ---
    @GetMapping("/getOnCallQuotationById/{id}")
    public ResponseEntity<OncallResponseDto> getOnCallQuotationById(@PathVariable Integer id) {
        OncallResponseDto response = oncallService.getOnCallQuotationById(id);
        return ResponseEntity.ok(response);
    }

    // --- UPDATE isFinal status ---
    @PatchMapping("/updateIsFinal/{id}")
    public ResponseEntity<String> updateIsFinalStatus(
            @PathVariable Integer id,
            @RequestParam Boolean isFinal
    ) {
        boolean updated = oncallService.updateIsFinalStatus(id, isFinal);
        if (updated)
            return ResponseEntity.ok("OnCall quotation final status updated successfully.");
        else
            return ResponseEntity.badRequest().body("OnCall quotation not found.");
    }

    // --- GET Pre Data for OnCall Quotation creation ---
    @GetMapping("/preData/{combinedEnquiryId}")
    public ResponseEntity<OncallRequestDtoPreData> getOnCallQuotationPreData(@PathVariable Integer combinedEnquiryId) {
        OncallRequestDtoPreData preData = oncallService.getOnCallQuotationPreData(combinedEnquiryId);
        return ResponseEntity.ok(preData);
    }

    // --- GET Invoice Data for OnCall Quotation ---
    @GetMapping("/invoice/{onCallId}")
    public ResponseEntity<OncallQuotationInvoiceData> getOnCallQuotationInvoiceData(@PathVariable Integer onCallId) {
        OncallQuotationInvoiceData data = oncallService.getOnCallQuotationInvoiceData(onCallId);
        return ResponseEntity.ok(data);
    }
    
    
    @GetMapping("/getOncallQuotationPdfData/{id}")
    public ResponseEntity<OncallQuotationPdfData> getOncallQuotationPdfData(
            @PathVariable Integer id) {

        OncallQuotationPdfData oncallQuotationPdfData =
        		oncallService.getOncallQuotationPdfData(id);

        return ResponseEntity.ok(oncallQuotationPdfData);
    }
    
    
}
