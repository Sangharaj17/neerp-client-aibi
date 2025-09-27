package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.entity.Features;
import com.aibi.neerp.componentpricing.service.FeaturesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/features")
@RequiredArgsConstructor
public class FeaturesController {

    private final FeaturesService featuresService;

    @PostMapping
    public ResponseEntity<Features> createFeature(@RequestBody Features feature) {
        return ResponseEntity.ok(featuresService.createFeature(feature));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Features> updateFeature(@PathVariable Integer id, @RequestBody Features feature) {
        return ResponseEntity.ok(featuresService.updateFeature(id, feature));
    }

    @GetMapping
    public ResponseEntity<List<Features>> getAllFeatures() {
        return ResponseEntity.ok(featuresService.getAllFeatures());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Features> getFeatureById(@PathVariable Integer id) {
        return ResponseEntity.ok(featuresService.getFeatureById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeature(@PathVariable Integer id) {
        featuresService.deleteFeature(id);
        return ResponseEntity.noContent().build();
    }
}
