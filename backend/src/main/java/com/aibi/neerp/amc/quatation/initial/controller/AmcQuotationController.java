package com.aibi.neerp.amc.quatation.initial.controller;

import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationRequestDto;
import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationResponseDto;
import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationViewResponseDto;
import com.aibi.neerp.amc.quatation.initial.dto.EditQuotationResponseDto;
import com.aibi.neerp.amc.quatation.initial.service.AmcQuotationService;

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
@RequestMapping("/api/amc/quotation/initial")
@RequiredArgsConstructor
@Slf4j
public class AmcQuotationController {

    private final AmcQuotationService service;

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<String> createAmcQuotation(@RequestBody AmcQuotationRequestDto dto) {
        log.info("Creating AMC Quotation: {}", dto);
        service.createAmcQuotation(dto);
        log.info("AMC Quotation created successfully");
        return ResponseEntity.ok("Success");
    }

    // ================= UPDATE =================
//    @PutMapping("/{id}")
//    public ResponseEntity<String> updateAmcQuotation(@PathVariable Integer id,
//                                                     @RequestBody AmcQuotationRequestDto dto) {
//        log.info("Updating AMC Quotation with ID {}: {}", id, dto);
//        service.updateAmcQuotation(id, dto);
//        log.info("AMC Quotation updated successfully");
//        return ResponseEntity.ok("Success");
//    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAmcQuotation(@PathVariable Integer id) {
        log.info("Deleting AMC Quotation with ID {}", id);
        service.deleteAmcQuotation(id);
        log.info("AMC Quotation deleted successfully");
        return ResponseEntity.ok("Success");
    }

    // ================= GET SINGLE =================
    @GetMapping("/{quotationId}")
    public ResponseEntity<AmcQuotationViewResponseDto> getQuotationDetails(
            @PathVariable Integer quotationId) {
        log.info("Fetching AMC Quotation details for ID: {}", quotationId);

        AmcQuotationViewResponseDto responseDto = service.getQuotationDetails(quotationId);

        return ResponseEntity.ok(responseDto);
    }

    // ================= GET ALL =================
    @GetMapping("/search")
    public Page<AmcQuotationResponseDto> searchAmcQuotations(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateSearch,
        Pageable pageable) {
        
        return service.searchAmcQuotations(search, dateSearch, pageable);
    }
    
    @GetMapping("/getQuotationByIdForEdit/{id}")
    public ResponseEntity<EditQuotationResponseDto> getQuotationById(@PathVariable Integer id) {
        EditQuotationResponseDto responseDto = service.getQuotationById(id);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping
    public ResponseEntity<String> updateAmcQuotation(@RequestBody AmcQuotationRequestDto dto) {
        log.info("Updating AMC Quotation with 85 ID {}: {}", dto.getLeadId(), dto);
        service.updateAmcQuotation(dto);
        return ResponseEntity.ok("AMC Quotation updated successfully");
    }
    
 // ✅ Finalize Quotation and Create Customer + Site if Needed
    @PutMapping("/{id}/finalize")
    public ResponseEntity<String> finalizeQuotation(@PathVariable("id") Integer quotationId) {
        String result = service.setIsFinal(quotationId);
        return ResponseEntity.ok(result);
    }



}
