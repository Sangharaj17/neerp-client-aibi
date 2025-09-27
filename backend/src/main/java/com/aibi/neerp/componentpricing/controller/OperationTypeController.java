package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.entity.OperationType;
import com.aibi.neerp.componentpricing.service.OperationTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operationType")
@RequiredArgsConstructor
public class OperationTypeController {

    private final OperationTypeService OperationTypeService;

    @PostMapping
    public ResponseEntity<OperationType> createFeature(@RequestBody OperationType feature) {
        return ResponseEntity.ok(OperationTypeService.createFeature(feature));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OperationType> updateFeature(@PathVariable Integer id, @RequestBody OperationType feature) {
        return ResponseEntity.ok(OperationTypeService.updateFeature(id, feature));
    }

    @GetMapping
    public ResponseEntity<List<OperationType>> getAllOperationType() {
        return ResponseEntity.ok(OperationTypeService.getAllOperationType());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OperationType> getFeatureById(@PathVariable Integer id) {
        return ResponseEntity.ok(OperationTypeService.getFeatureById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeature(@PathVariable Integer id) {
        OperationTypeService.deleteFeature(id);
        return ResponseEntity.noContent().build();
    }
}
