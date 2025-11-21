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

    @GetMapping("/byMainId/{mainId}")
    public ApiResponse<List<OtherMaterialResponseDTO>> getByOtherMaterialMainId(@PathVariable Long mainId) {
        log.info("API Request: Fetch OtherMaterial by OtherMaterialMainId={}", mainId);

        List<OtherMaterialResponseDTO> results = service.findByOtherMaterialMainId(mainId);

        if (results.isEmpty()) {
            return new ApiResponse<>(false, "No Other Material found for mainId=" + mainId, null);
        }
        return new ApiResponse<>(true, "Fetched Other Materials for mainId=" + mainId + " successfully", results);
    }


    @GetMapping("/searchMachineByLiftType_Operator_Capacity_Floors")
    public ApiResponse<List<OtherMaterialResponseDTO>> searchByCriteria(
            @RequestParam Integer operatorId,
            @RequestParam Integer capacityTypeId,
            @RequestParam Integer capacityValueId,
            @RequestParam Integer typeOfLift,
            @RequestParam Integer floors) {

        log.info("API Request: Search OtherMaterial by operatorId={}, capacityTypeId={}, capacityValueId={}, typeOfLift={}, floors={}",
                operatorId, capacityTypeId, capacityValueId, typeOfLift, floors);

        List<OtherMaterialResponseDTO> results =
                service.searchByLiftTypeAndCapacity(operatorId, capacityTypeId, capacityValueId, typeOfLift, floors);

        if (results.isEmpty()) {
            return new ApiResponse<>(false, "No material found for given criteria", null);
        }
        return new ApiResponse<>(true, "Fetched other material for "+operatorId+" - "+capacityTypeId+" - "+capacityValueId+" - "+typeOfLift +"  successfully", results);
    }

    @GetMapping("/searchMachineByCapacity_LiftType_MainType")
    public ApiResponse<List<OtherMaterialResponseDTO>> searchByCapacityAndLiftTypeAndMainType(
            @RequestParam Integer capacityTypeId,
            @RequestParam Integer capacityValueId,
            @RequestParam Integer typeOfLift, // Maps to machineRoomId/LiftType in DB
            @RequestParam String materialMainType) {

        log.info("API Request: Search OtherMaterial by capacityTypeId={}, capacityValueId={}, typeOfLift={}, materialMainType={}",
                capacityTypeId, capacityValueId, typeOfLift, materialMainType);

        // Call the service method that excludes operator and floors
        List<OtherMaterialResponseDTO> results =
                service.searchByCapacityAndLiftTypeAndMainType(capacityTypeId, capacityValueId, typeOfLift, materialMainType);

        if (results.isEmpty()) {
            return new ApiResponse<>(false, "No material found for given capacity, lift type, and main type.", null);
        }
        return new ApiResponse<>(true,
                "Fetched other material successfully for Capacity Type ID: " + capacityTypeId +
                        ", Capacity Value ID: " + capacityValueId +
                        ", Lift Type: " + typeOfLift +
                        ", Main Type: " + materialMainType,
                results);
    }

    @GetMapping("/searchMachineByCapacity_LiftType")
    public ApiResponse<List<OtherMaterialResponseDTO>> searchByCapacityAndLiftType(
            @RequestParam Integer capacityTypeId,
            @RequestParam Integer capacityValueId,
            @RequestParam Integer typeOfLift) { // Corresponds to machineRoomId in the service

        log.info("API Request: Search OtherMaterial by capacityTypeId={}, capacityValueId={}, typeOfLift={}",
                capacityTypeId, capacityValueId, typeOfLift);

        List<OtherMaterialResponseDTO> results =
                service.searchByCapacityAndMachineRoom(capacityTypeId, capacityValueId, typeOfLift);

        if (results.isEmpty()) {
            return new ApiResponse<>(false, "No material found for given criteria (Capacity and Lift Type)", null);
        }

        return new ApiResponse<>(
                true,
                "Fetched other material for capacityTypeId=" + capacityTypeId + " and typeOfLift=" + typeOfLift + " successfully",
                results
        );
    }

    @GetMapping("/byOperator/{operatorId}/excludeOthers")
    public ApiResponse<List<OtherMaterialResponseDTO>> getByOperatorExcludingOthers(@PathVariable Integer operatorId) {
        log.info("API Request: Fetch OtherMaterial by operatorId={} excluding 'Others'", operatorId);

        List<OtherMaterialResponseDTO> results = service.findByOperatorIdExcludingOthers(operatorId);

        if (results.isEmpty()) {
            return new ApiResponse<>(false, "No Other Material found for operatorId=" + operatorId + " (excluding 'Others')", null);
        }

        return new ApiResponse<>(true, "Fetched Other Materials for operatorId=" + operatorId + " excluding 'Others' successfully", results);
    }

    @GetMapping("/byOperator/{operatorId}/mainTypeContains/{keyword}")
    public ApiResponse<List<OtherMaterialResponseDTO>> getByOperatorAndMainTypeContains(
            @PathVariable Integer operatorId,
            @PathVariable String keyword) {

        log.info("API Request: Fetch OtherMaterial where mainType contains '{}' and operatorId={}", keyword, operatorId);

        List<OtherMaterialResponseDTO> results = service.findByOperatorAndMainTypeContaining(operatorId, keyword);

        if (results.isEmpty()) {
            return new ApiResponse<>(false, "No Other Material found where mainType contains '" + keyword +
                    "' and operatorId=" + operatorId, null);
        }

        return new ApiResponse<>(true,
                "Fetched Other Materials where mainType contains '" + keyword + "' and operatorId=" + operatorId + " successfully",
                results);
    }




}
