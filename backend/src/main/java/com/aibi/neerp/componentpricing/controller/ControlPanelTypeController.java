package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.ControlPanelTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.ControlPanelTypeResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.ControlPanelTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/control-panel-types")
@RequiredArgsConstructor
@Slf4j
public class ControlPanelTypeController {

    private final ControlPanelTypeService service;

    @PostMapping
    public ResponseEntity<ApiResponse<ControlPanelTypeResponseDTO>> create(
            @Valid @RequestBody ControlPanelTypeRequestDTO dto) {
        log.info("API Request: Create ControlPanelType");
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ControlPanelTypeResponseDTO>> update(
            @PathVariable Integer id,
            @Valid @RequestBody ControlPanelTypeRequestDTO dto) {
        log.info("API Request: Update ControlPanelType ID {}", id);
        return ResponseEntity.ok(service.update(id, dto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ControlPanelTypeResponseDTO>>> getAll(
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        log.info("API Request: Get All ControlPanelTypes");
        return ResponseEntity.ok(service.getAll(sortBy, direction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        log.info("API Request: Delete ControlPanelType ID {}", id);
        return ResponseEntity.ok(service.delete(id));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ControlPanelTypeResponseDTO>>> search(
            @RequestParam(required = false) Integer operatorTypeId,
            @RequestParam(required = false) Integer capacityTypeId,
            @RequestParam(required = false) Integer machineTypeId,
            @RequestParam(required = false) Integer capacityValue  // can be personCapacityId or weightId
    ) {
        log.info("API Request: Search ControlPanelTypes with operatorTypeId={}, capacityTypeId={}, machineTypeId={}, capacityValue={}",
                operatorTypeId, capacityTypeId, machineTypeId, capacityValue);
        return ResponseEntity.ok(service.search(operatorTypeId, capacityTypeId, machineTypeId, capacityValue));
    }


}
