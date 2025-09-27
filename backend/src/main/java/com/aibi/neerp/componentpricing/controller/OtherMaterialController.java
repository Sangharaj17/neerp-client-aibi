package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.OtherMaterialRequestDTO;
import com.aibi.neerp.componentpricing.dto.OtherMaterialResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.OtherMaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/other-material")
@RequiredArgsConstructor
public class OtherMaterialController {

    private final OtherMaterialService service;

    @GetMapping
    //@PreAuthorize("hasAuthority('ROLE_READ_ONLY') or hasAuthority('ROLE_ADMIN')")
    public List<OtherMaterialResponseDTO> getAll() {
        log.info("API Request: Fetch all OtherMaterial");
        return service.findAll();
    }

    @PostMapping
    //@PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<OtherMaterialResponseDTO> create(@Valid @RequestBody OtherMaterialRequestDTO dto) {
        log.info("API Request: Create OtherMaterial");
        return service.create(dto);
    }

    @PutMapping("/{id}")
    //@PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<OtherMaterialResponseDTO> update(@PathVariable Integer id,
                                                        @Valid @RequestBody OtherMaterialRequestDTO dto) {
        log.info("API Request: Update OtherMaterial id={}", id);
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<String> delete(@PathVariable Integer id) {
        log.warn("API Request: Delete OtherMaterial id={}", id);
        return service.delete(id);
    }

    @GetMapping("/searchByLiftyType_Operator_Capacity")
    public ApiResponse<List<OtherMaterialResponseDTO>> searchByCriteria(
            @RequestParam Integer operatorId,
            @RequestParam Integer capacityTypeId,
            @RequestParam Integer capacityValueId,
            @RequestParam Integer typeOfLift) {

        log.info("API Request: Search OtherMaterial by operatorId={}, capacityTypeId={}, capacityValueId={}, typeOfLift={}",
                operatorId, capacityTypeId, capacityValueId, typeOfLift);

        List<OtherMaterialResponseDTO> results =
                service.searchByLiftTypeAndCapacity(operatorId, capacityTypeId, capacityValueId, typeOfLift);

        if (results.isEmpty()) {
            return new ApiResponse<>(false, "No material found for given criteria", null);
        }
        return new ApiResponse<>(true, "Fetched other material for "+operatorId+" - "+capacityTypeId+" - "+capacityValueId+" - "+typeOfLift +"  successfully", results);
    }

}
