package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.GovernorRopeRequestDTO;
import com.aibi.neerp.componentpricing.dto.GovernorRopeResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.GovernorRopeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/governor-ropes")
@RequiredArgsConstructor
@Slf4j
public class GovernorRopeController {

    private final GovernorRopeService governorRopeService;

    @PostMapping
    public ResponseEntity<ApiResponse<GovernorRopeResponseDTO>> createGovernorRope(
            @Valid @RequestBody GovernorRopeRequestDTO requestDTO) {
        GovernorRopeResponseDTO created = governorRopeService.createGovernorRope(requestDTO);
        return ResponseEntity.ok(new ApiResponse<>(true, "Governor rope created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GovernorRopeResponseDTO>> updateGovernorRope(
            @PathVariable int id,
            @Valid @RequestBody GovernorRopeRequestDTO requestDTO) {
        GovernorRopeResponseDTO updated = governorRopeService.updateGovernorRope(id, requestDTO);
        return ResponseEntity.ok(new ApiResponse<>(true, "Governor rope updated successfully", updated));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GovernorRopeResponseDTO>>> getAllGovernorRopes(
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        List<GovernorRopeResponseDTO> list = governorRopeService.getAllGovernorRopes(sortBy, sortDir);
        return ResponseEntity.ok(new ApiResponse<>(true, "Governor ropes fetched successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GovernorRopeResponseDTO>> getGovernorRopeById(@PathVariable int id) {
        GovernorRopeResponseDTO rope = governorRopeService.getGovernorRopeById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Governor rope fetched successfully", rope));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGovernorRope(@PathVariable int id) {
        governorRopeService.deleteGovernorRope(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Governor rope deleted successfully", null));
    }
}
