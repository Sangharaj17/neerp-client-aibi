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
    
    
    
    
    
    
    
    
}

