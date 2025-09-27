package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.entity.AdditionalFloors;
import com.aibi.neerp.componentpricing.service.AdditionalFloorsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/additional-floors")
@RequiredArgsConstructor
public class AdditionalFloorsController {

    private final AdditionalFloorsService service;

    @GetMapping
    public ResponseEntity<List<AdditionalFloors>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<AdditionalFloors> create(@RequestBody AdditionalFloors Floors) {
        return ResponseEntity.ok(service.create(Floors));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdditionalFloors> update(
            @PathVariable Integer id,
            @RequestBody AdditionalFloors Floors) {
        return ResponseEntity.ok(service.update(id, Floors));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

