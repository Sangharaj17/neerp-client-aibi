package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.entity.Speed;
import com.aibi.neerp.componentpricing.service.SpeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/speeds")
@RequiredArgsConstructor
public class SpeedController {
    private final SpeedService service;

    @GetMapping
    public ResponseEntity<List<Speed>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<Speed> create(@RequestBody Speed speed) {
        return ResponseEntity.ok(service.create(speed));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Speed> update(@PathVariable Integer id, @RequestBody Speed speed) {
        return ResponseEntity.ok(service.update(id, speed));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.ok("Speed deleted successfully");
    }
}

