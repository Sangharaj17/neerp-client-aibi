package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.LoadRequestDTO;
import com.aibi.neerp.componentpricing.dto.LoadResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.LoadService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/load")
@CrossOrigin(origins = "*")
public class LoadController {

    private final LoadService loadService;

    public LoadController(LoadService loadService) {
        this.loadService = loadService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LoadResponseDTO>> create(@RequestBody LoadRequestDTO dto) {
        return ResponseEntity.ok(loadService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LoadResponseDTO>> update(
            @PathVariable Integer id, @RequestBody LoadRequestDTO dto) {
        return ResponseEntity.ok(loadService.update(id, dto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LoadResponseDTO>>> findAll() {
        return ResponseEntity.ok(loadService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoadResponseDTO>> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(loadService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        return ResponseEntity.ok(loadService.delete(id));
    }
}

