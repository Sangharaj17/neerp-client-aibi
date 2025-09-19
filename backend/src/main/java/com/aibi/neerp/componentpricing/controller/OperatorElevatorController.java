package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.dto.OperatorElevatorRequestDTO;
import com.aibi.neerp.componentpricing.dto.OperatorElevatorResponseDTO;
import com.aibi.neerp.componentpricing.service.OperatorElevatorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/operator-elevator")
@RequiredArgsConstructor
public class OperatorElevatorController {

    private final OperatorElevatorService service;

    @PostMapping
    public ResponseEntity<ApiResponse<OperatorElevatorResponseDTO>> create(
            @Valid @RequestBody OperatorElevatorRequestDTO dto) {
        log.info("Request to create OperatorElevator: {}", dto.getName());
        var response = service.createOperator(dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Operator created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OperatorElevatorResponseDTO>>> getAll() {
        var list = service.getAllOperators();
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched all operators", list));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OperatorElevatorResponseDTO>> update(
            @PathVariable Integer id,
            @Valid @RequestBody OperatorElevatorRequestDTO dto) {
        log.info("Request to update OperatorElevator ID {}: {}", id, dto.getName());
        var response = service.updateOperator(id, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Operator updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        log.warn("Request to delete OperatorElevator ID {}", id);
        service.deleteOperator(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Operator deleted successfully", null));
    }
}
