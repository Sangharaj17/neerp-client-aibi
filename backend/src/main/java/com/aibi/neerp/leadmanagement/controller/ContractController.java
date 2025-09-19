package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.dto.ContractDto;
import com.aibi.neerp.leadmanagement.service.ContractService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/contracts")
public class ContractController {

    @Autowired
    private ContractService contractService;

    @GetMapping
    public ResponseEntity<List<ContractDto>> getAllContracts() {
        return ResponseEntity.ok(contractService.getAllContracts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractDto> getContractById(@PathVariable Integer id) {
        return ResponseEntity.ok(contractService.getContractById(id));
    }

    @PostMapping
    public ResponseEntity<ContractDto> createContract(@Valid @RequestBody ContractDto contractDto) {
        return ResponseEntity.ok(contractService.createContract(contractDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContract(@PathVariable Integer id) {
        contractService.deleteContract(id);
        return ResponseEntity.noContent().build();
    }
} 
