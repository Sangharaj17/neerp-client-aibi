package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.WeightRequestDTO;
import com.aibi.neerp.componentpricing.dto.WeightResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.WeightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weights")
@RequiredArgsConstructor
public class WeightController {

    private final WeightService weightService;

    // GET all weights
    @GetMapping
    public ResponseEntity<ApiResponse<List<WeightResponseDTO>>> getAllWeights() {
        List<WeightResponseDTO> list = weightService.getAllWeights();
        return ResponseEntity.ok(new ApiResponse<>(true, "Weights fetched", list));
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WeightResponseDTO>> getWeightById(@PathVariable Integer id) {
        return ResponseEntity.ok(weightService.getWeightById(id));
    }

    // CREATE new weight
    @PostMapping
    public ResponseEntity<ApiResponse<WeightResponseDTO>> createWeight(@RequestBody WeightRequestDTO dto) {
        WeightResponseDTO created = weightService.createWeight(dto).getData();
        return ResponseEntity.ok(new ApiResponse<>(true, "Weight created", created));
    }

    // UPDATE existing weight
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WeightResponseDTO>> updateWeight(@PathVariable Integer id,
                                                                       @RequestBody WeightRequestDTO dto) {
        // Optional: Prevent editing of Kg (id = 1)
//        if (dto.getUnitId() == 1) {
//            throw new IllegalArgumentException("Editing the 'Kg' unit weight is not allowed.");
//        }
        WeightResponseDTO updated = weightService.updateWeight(id, dto).getData();
        return ResponseEntity.ok(new ApiResponse<>(true, "Weight updated", updated));
    }

    // DELETE weight
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteWeight(@PathVariable Integer id) {
        // Optional: Prevent deleting Kg by ID
        if (id == 1) {
            throw new IllegalArgumentException("Deleting the 'Kg' unit weight is not allowed.");
        }
        weightService.deleteWeight(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Weight deleted", null));
    }
}
