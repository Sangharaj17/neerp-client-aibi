package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.entity.Warranty;
import com.aibi.neerp.componentpricing.service.WarrantyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warranties")
@RequiredArgsConstructor
@Slf4j
public class WarrantyController {

    private final WarrantyService warrantyService;

    @GetMapping
    public ResponseEntity<List<Warranty>> getAllWarranties() {
        return ResponseEntity.ok(warrantyService.getAllWarranties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Warranty> getWarrantyById(@PathVariable Integer id) {
        return ResponseEntity.ok(warrantyService.getWarrantyById(id));
    }

    @PostMapping
    public ResponseEntity<Warranty> createWarranty(@RequestBody Warranty warranty) {
        return ResponseEntity.ok(warrantyService.createWarranty(warranty));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Warranty> updateWarranty(@PathVariable Integer id, @RequestBody Warranty warranty) {
        return ResponseEntity.ok(warrantyService.updateWarranty(id, warranty));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWarranty(@PathVariable Integer id) {
        warrantyService.deleteWarranty(id);
        return ResponseEntity.ok("Warranty deleted successfully");
    }

    // 🔥 Bulk generate warranties (truncate + regenerate)
    @PostMapping("/generate/{months}")
    public ResponseEntity<List<Warranty>> generateWarranties(@PathVariable int months) {
        return ResponseEntity.ok(warrantyService.generateWarranties(months));
    }
}

