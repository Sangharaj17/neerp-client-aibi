package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.InstallationRuleRequestDTO;
import com.aibi.neerp.componentpricing.dto.InstallationRuleResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.InstallationRuleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/installation-rules")
@RequiredArgsConstructor
@Slf4j
public class InstallationRuleController {

    private final InstallationRuleService service;

    @PostMapping
    public ResponseEntity<ApiResponse<InstallationRuleResponseDTO>> createRule(
            @RequestBody InstallationRuleRequestDTO dto) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Rule created successfully", service.createRule(dto))
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InstallationRuleResponseDTO>>> getAllRules() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Rules fetched successfully", service.getAllRules())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InstallationRuleResponseDTO>> getRuleById(@PathVariable Long id) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Rule fetched successfully", service.getRuleById(id))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InstallationRuleResponseDTO>> updateRule(
            @PathVariable Long id,
            @RequestBody InstallationRuleRequestDTO dto) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Rule updated successfully", service.updateRule(id, dto))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRule(@PathVariable Long id) {
        service.deleteRule(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Rule deleted successfully", null));
    }

//    @GetMapping("/floor/{floorName}/lift/{liftType}")
//    public ResponseEntity<ApiResponse<InstallationRuleResponseDTO>> getRuleForFloorAndLift(
//            @PathVariable String floorName,
//            @PathVariable Integer liftType) {
//
//        log.info("Fetching installation rule for floorName={} and liftType={}", floorName, liftType);
//
//        InstallationRuleResponseDTO rule = service.findRuleForFloorAndLift(floorName, liftType);
//
//        return ResponseEntity.ok(
//                new ApiResponse<>(true, "Rule fetched successfully", rule)
//        );
//    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<InstallationRuleResponseDTO>> getRuleForFloorAndLift(
            @RequestParam Integer floorId,
            @RequestParam Integer liftType) {

        log.info("Fetching installation rule for floorId={} and liftType={}", floorId, liftType);

        InstallationRuleResponseDTO rule = service.findRuleForFloorAndLift(floorId, liftType);

        if (rule == null) {
            return ResponseEntity.ok(
                    new ApiResponse<>(false, "No installation rule found for given floor and lift type", null)
            );
        }else{
            rule.setAmount(rule.getBaseAmount() + rule.getExtraAmount());
        }

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Rule fetched successfully", rule)
        );
    }


}
