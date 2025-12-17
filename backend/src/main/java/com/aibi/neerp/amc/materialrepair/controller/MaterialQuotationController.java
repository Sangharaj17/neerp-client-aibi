package com.aibi.neerp.amc.materialrepair.controller;


import com.aibi.neerp.amc.materialrepair.dto.*;
import com.aibi.neerp.amc.materialrepair.service.MaterialQuotationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/amc/material-quotation")
@RequiredArgsConstructor
@Slf4j
public class MaterialQuotationController {

    private final MaterialQuotationService materialQuotationService;

    // 🔹 CREATE / SAVE Material Quotation
    @PostMapping("/save")
    public MaterialQuotationResponseDto saveMaterialQuotation(@RequestBody MaterialQuotationRequestDto dto) {
        log.info("Saving Material Quotation: {}", dto);
        return materialQuotationService.saveMaterialQuotation(dto);
    }
    
    @GetMapping("/getMaterialQuotationRequestGetData")
    public ResponseEntity<MaterialQuotationRequestGetData> getMaterialQuotationRequestGetData(){
    	
    	return  materialQuotationService.getMaterialQuotationRequestGetData();
    }
    
    

//    // 🔹 GET ONE BY ID
//    @GetMapping("/getById/{id}")
//    public MaterialQuotationResponseDto getMaterialQuotationById(@PathVariable Integer id) {
//        log.info("Fetching Material Quotation by ID: {}", id);
//        return materialQuotationService.getMaterialQuotationById(id);
//    }

    // 🔹 GET ALL with Pagination + Search + Sorting
    @GetMapping("/getAll")
    public Page<MaterialQuotationResponseDto> getAllMaterialQuotations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateSearch,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "modQuotId") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        log.info("Fetching Material Quotations with search='{}', date='{}', page={}, size={}, sortBy={}, direction={}",
                search, dateSearch, page, size, sortBy, direction);

        return materialQuotationService.getAllMaterialQuotations(
                search, dateSearch, page, size, sortBy, direction
        );
    }
    
    
    @GetMapping("/getMaterialRepairQuatationPdfData/{material_q_id}")
    public ResponseEntity<MaterialRepairQuatationPdfData> 
                 getMaterialRepairQuatationPdfData(@PathVariable Integer material_q_id) {
    	
    	MaterialRepairQuatationPdfData materialRepairQuatationPdfData =
    			materialQuotationService.getMaterialRepairQuatationPdfData(material_q_id);
    	
    	return ResponseEntity.ok(materialRepairQuatationPdfData);
    }
    
    
    
    @PatchMapping("/updateIsFinal/{id}")
    public ResponseEntity<String> updateIsFinalStatus(
            @PathVariable Integer id,
            @RequestParam Boolean isFinal) {

        boolean updated = materialQuotationService.updateIsFinalStatus(id, isFinal);

        if (updated) {
            return ResponseEntity.ok("Material quotation status updated successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<MaterialQuotationResponseDto> updateQuotation(
            @PathVariable Integer id,
            @RequestBody MaterialQuotationUpdateRequestDto updateDto) {
        
        log.info("Updating Material Quotation ID: {}", id);
        MaterialQuotationResponseDto updatedQuotation = materialQuotationService.updateMaterialQuotation(id, updateDto);
        return ResponseEntity.ok(updatedQuotation);
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteQuotation(@PathVariable Integer id) {
        log.info("Request to delete Material Quotation ID: {}", id);
        materialQuotationService.deleteQuotation(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Quotation deleted successfully");
        return ResponseEntity.ok(response);
    }
    
   
    
    
}

