package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.CabinSubTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.CabinSubTypeResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.CabinSubTypeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cabinSubType")
@RequiredArgsConstructor
@Slf4j
public class CabinSubTypeController {

    private final CabinSubTypeService service;

    @PostMapping
    public ResponseEntity<ApiResponse<CabinSubTypeResponseDTO>> create(@Validated @RequestBody CabinSubTypeRequestDTO dto) {
        log.info("Request received to create Cabin SubType with name: {}", dto.getCabinSubName());
        CabinSubTypeResponseDTO saved = service.createCabinSubType(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Cabin SubType created successfully", saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CabinSubTypeResponseDTO>>> getAll() {
        log.info("Fetching all Cabin SubTypes");
        List<CabinSubTypeResponseDTO> list = service.getAllCabinSubTypes();
        return ResponseEntity.ok(new ApiResponse<>(true, "Cabin SubTypes fetched successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CabinSubTypeResponseDTO>> getById(@PathVariable Integer id) {
        log.info("Fetching Cabin SubType with ID: {}", id);
        CabinSubTypeResponseDTO dto = service.getById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cabin SubType fetched successfully", dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CabinSubTypeResponseDTO>> update(@PathVariable Integer id,
                                                                       @Validated @RequestBody CabinSubTypeRequestDTO dto) {
        log.info("Updating Cabin SubType with ID: {}", id);
        CabinSubTypeResponseDTO updated = service.updateCabinSubType(id, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cabin SubType updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        log.warn("Deleting Cabin SubType with ID: {}", id);
        service.deleteCabinSubType(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cabin SubType deleted successfully", null));
    }

    @GetMapping("/by-cabin-type/{cabinTypeId}")
    public ResponseEntity<ApiResponse<List<CabinSubTypeResponseDTO>>> getByCabinType(@PathVariable Integer cabinTypeId) {
        log.info("Fetching Cabin SubTypes by Cabin Type ID: {}", cabinTypeId);
        List<CabinSubTypeResponseDTO> list = service.getByCabinTypeId(cabinTypeId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cabin SubTypes for Cabin Type fetched successfully", list));
    }

    @GetMapping("/searchByCabinTypeAndCapacity")
    public ResponseEntity<ApiResponse<List<CabinSubTypeResponseDTO>>> searchByCabinTypeAndCapacity(
            @RequestParam Integer cabinType,
            @RequestParam Integer capacityTypeId,
            @RequestParam Integer capacityValueId) {

        log.info("API request: searchByCabinTypeAndCapacity cabinType={}, capacityTypeId={}, capacityValueId={}",
                cabinType, capacityTypeId, capacityValueId);

        List<CabinSubTypeResponseDTO> list = service.searchByCabinTypeAndCapacity(cabinType, capacityTypeId, capacityValueId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Cabin SubTypes fetched successfully for given criteria", list)
        );
    }

}
