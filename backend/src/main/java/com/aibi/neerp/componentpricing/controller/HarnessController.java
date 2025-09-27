package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.HarnessRequestDTO;
import com.aibi.neerp.componentpricing.dto.HarnessResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.HarnessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/harness")
@RequiredArgsConstructor
@Slf4j
public class HarnessController {

    private final HarnessService harnessService;

    @PostMapping
    public ResponseEntity<ApiResponse<HarnessResponseDTO>> createHarness(@Valid @RequestBody HarnessRequestDTO dto) {
        log.info("API called: Create Harness");
        return ResponseEntity.ok(harnessService.createHarness(dto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HarnessResponseDTO>>> getAllHarnessesSorted() {
        log.info("API called: Get All Harnesses Sorted");
        return ResponseEntity.ok(harnessService.getAllHarnessesSorted());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HarnessResponseDTO>> getHarnessById(@PathVariable int id) {
        log.info("API called: Get Harness by ID {}", id);
        return ResponseEntity.ok(harnessService.getHarnessById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HarnessResponseDTO>> updateHarness(
            @PathVariable int id,
            @Valid @RequestBody HarnessRequestDTO dto) {
        log.info("API called: Update Harness ID {}", id);
        return ResponseEntity.ok(harnessService.updateHarness(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteHarness(@PathVariable int id) {
        log.info("API called: Delete Harness ID {}", id);
        return ResponseEntity.ok(harnessService.deleteHarness(id));
    }

    @GetMapping("/searchByFloorDesignation")
    public ResponseEntity<ApiResponse<List<HarnessResponseDTO>>> searchByFloorDesignation(
            @RequestParam String floorDesignations) {
        log.info("API called: Search Harness by floorDesignations={}", floorDesignations);
        return ResponseEntity.ok(harnessService.findByFloorDesignation(floorDesignations));
    }

}
