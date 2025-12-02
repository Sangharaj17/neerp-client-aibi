package com.aibi.neerp.userresource.controller;

import com.aibi.neerp.userresource.entity.TaxType;
import com.aibi.neerp.userresource.service.TaxTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tax-types")
@CrossOrigin
public class TaxTypeController {

    @Autowired
    private TaxTypeService taxTypeService;

    @PostMapping
    public ResponseEntity<TaxType> createTaxType(@RequestBody TaxType taxType) {
        try {
            // Validate required fields
            if (taxType.getTaxName() == null || taxType.getTaxName().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (taxType.getTaxPercentage() == null || taxType.getTaxPercentage() < 0 || taxType.getTaxPercentage() > 100) {
                return ResponseEntity.badRequest().build();
            }
            TaxType saved = taxTypeService.createTaxType(taxType);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<TaxType>> getAllTaxTypes() {
        return ResponseEntity.ok(taxTypeService.getAllTaxTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaxType> getTaxTypeById(@PathVariable Integer id) {
        TaxType taxType = taxTypeService.getTaxTypeById(id);
        if (taxType != null) {
            return ResponseEntity.ok(taxType);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaxType> updateTaxType(@PathVariable Integer id, @RequestBody TaxType taxType) {
        TaxType updated = taxTypeService.updateTaxType(id, taxType);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaxType(@PathVariable Integer id) {
        taxTypeService.deleteTaxType(id);
        return ResponseEntity.noContent().build();
    }
}

