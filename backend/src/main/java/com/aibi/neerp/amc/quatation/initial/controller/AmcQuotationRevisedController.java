package com.aibi.neerp.amc.quatation.initial.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationRequestDto;
import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationResponseDto;
import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationViewResponseDto;
import com.aibi.neerp.amc.quatation.initial.dto.EditQuotationResponseDto;
import com.aibi.neerp.amc.quatation.initial.service.AmcQuotationRevisedService;
import com.aibi.neerp.amc.quatation.initial.service.AmcQuotationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/amc/quotation/initial/revised")
@RequiredArgsConstructor
@Slf4j
public class AmcQuotationRevisedController {
	
	
	@Autowired
	private AmcQuotationRevisedService amcQuotationRevisedService;
	
	 @PostMapping
	    public ResponseEntity<String> createAmcQuotation(@RequestBody AmcQuotationRequestDto dto) {
	        log.info("Creating AMC Revised Quotation: {}", dto);
	        amcQuotationRevisedService.createAmcRevisedQuotation(dto);
	        log.info("AMC Revised Quotation created successfully");
	        return ResponseEntity.ok("Success");
	    }
	 
	 @GetMapping("/by-quotation/{quotationId}")
	 public ResponseEntity<List<AmcQuotationResponseDto>> getAllRevisedQuotationsByQuotationId(@PathVariable Integer quotationId) {
	     log.info("Fetching all Revised AMC Quotations for amc_quatation_id: {}", quotationId);
	     List<AmcQuotationResponseDto> responseList = amcQuotationRevisedService.getAllByAmcQuotationId(quotationId);

	     if (responseList.isEmpty()) {
	         log.warn("No Revised AMC Quotations found for amc_quatation_id: {}", quotationId);
	         return ResponseEntity.noContent().build();
	     }
	     return ResponseEntity.ok(responseList);
	 }
	 
	 @GetMapping("/getRevisedQuotationByIdForRevised/{id}")
	    public ResponseEntity<EditQuotationResponseDto> getRevisedQuotationByIdForRevised(@PathVariable Integer id) {
	        EditQuotationResponseDto responseDto = amcQuotationRevisedService.getQuotationById(id);
	        return ResponseEntity.ok(responseDto);
	    }
	 
	  @GetMapping("/getQuotationViewDetails/{quotationId}")
	    public ResponseEntity<AmcQuotationViewResponseDto> getQuotationDetails(
	            @PathVariable Integer quotationId) {
	        log.info("Fetching AMC Quotation details for ID: {}", quotationId);

	        AmcQuotationViewResponseDto responseDto = amcQuotationRevisedService.getQuotationDetails(quotationId);

	        return ResponseEntity.ok(responseDto);
	    }
	  
	  @PutMapping("/{id}/finalize")
	    public ResponseEntity<String> finalizeQuotation(@PathVariable("id") Integer quotationId) {
	        String result = amcQuotationRevisedService.setIsFinal(quotationId);
	        return ResponseEntity.ok(result);
	    }


}
