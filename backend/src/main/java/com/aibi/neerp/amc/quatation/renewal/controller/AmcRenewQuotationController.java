package com.aibi.neerp.amc.quatation.renewal.controller;

import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationRequestDto;
import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationResponseDto;
import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationViewResponseDto;
import com.aibi.neerp.amc.quatation.initial.dto.EditQuotationResponseDto;
import com.aibi.neerp.amc.quatation.initial.service.AmcQuotationService;
import com.aibi.neerp.amc.quatation.renewal.dto.AmcQuotationRenewalResponseDto;
import com.aibi.neerp.amc.quatation.renewal.dto.AmcRenewalQuotationRequestDto;
import com.aibi.neerp.amc.quatation.renewal.dto.AmcRenewalQuotationViewResponseDto;
import com.aibi.neerp.amc.quatation.renewal.dto.EditRenewQuotationResponseDto;
import com.aibi.neerp.amc.quatation.renewal.service.AmcRenewalQuotationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;            // <- needed


@RestController
@RequestMapping("/api/amc/quotation/renewal")
@RequiredArgsConstructor
@Slf4j
public class AmcRenewQuotationController {

    private final AmcRenewalQuotationService amcRenewalQuotationService;

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<String> createAmcRenewalQuotation(@RequestBody AmcRenewalQuotationRequestDto dto) {
        log.info("Creating AMC Renewal Quotation: {}", dto);
        amcRenewalQuotationService.createAmcRenewQuotation(dto);
        log.info("AMC Renewal Quotation created successfully");
        return ResponseEntity.ok("Success");
    }
    
    // ================= GET ALL =================
    @GetMapping("/searchAmcRenewalQuatations")
    public Page<AmcQuotationRenewalResponseDto> searchAmcRenewalQuotations(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateSearch,
        Pageable pageable) {
        
        return amcRenewalQuotationService.searchAmcRenewalQuotations(search, dateSearch, pageable);
    }
    
 // ================= GET SINGLE =================
    @GetMapping("/{quotationId}")
    public ResponseEntity<AmcRenewalQuotationViewResponseDto> getAmcRenewalQuotationViewDetails(
            @PathVariable Integer quotationId) {
        log.info("Fetching AMC Renewal Quotation view details for ID: {}", quotationId);

        AmcRenewalQuotationViewResponseDto responseDto = amcRenewalQuotationService.getAmcRenewalQuotationDetails(quotationId);

        return ResponseEntity.ok(responseDto);
    }
    
    @GetMapping("/getRenewAmcQuotationByIdForEdit/{id}")
    public ResponseEntity<EditRenewQuotationResponseDto> getQuotationById(@PathVariable Integer id) {
    	EditRenewQuotationResponseDto responseDto = amcRenewalQuotationService.getQuotationById(id);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping
    public ResponseEntity<String> updateAmcQuotation(@RequestBody AmcRenewalQuotationRequestDto dto) {
        log.info("Updating AMC Renew Quotation with 85 ID {}: {}", dto.getLeadId(), dto);
        amcRenewalQuotationService.updateAmcRenewQuotation(dto);
        return ResponseEntity.ok("AMC Renew Quotation updated successfully");
    }
    
 // ✅ Finalize Quotation and Create Customer + Site if Needed
    @PutMapping("/{id}/finalize")
    public ResponseEntity<String> finalizeQuotation(@PathVariable("id") Integer quotationId) {
        String result = amcRenewalQuotationService.setIsFinal(quotationId);
        return ResponseEntity.ok(result);
    }
    
 // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAmcRenewalQuotation(@PathVariable Integer id) {
        log.info("Deleting AMC Renewal Quotation with ID {}", id);
        
        // Service method will throw exceptions or return success message
        String message = amcRenewalQuotationService.deleteAmcQuotation(id);
        
        log.info("AMC Renewal Quotation deleted successfully with ID {}", id);
        return ResponseEntity.ok(message);
    }



}

