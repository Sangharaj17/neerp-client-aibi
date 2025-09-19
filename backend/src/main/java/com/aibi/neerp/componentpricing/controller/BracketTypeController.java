package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.BracketTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.BracketTypeResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.BracketTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/bracket-types")
@RequiredArgsConstructor
public class BracketTypeController {

    private final BracketTypeService bracketTypeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BracketTypeResponseDTO>>> getAll(
            @RequestParam(defaultValue = "name") String sortBy) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched bracket types",
                bracketTypeService.getAllBracketTypes(sortBy)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BracketTypeResponseDTO>> getById(@PathVariable int id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Bracket type fetched",
                bracketTypeService.getBracketTypeById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BracketTypeResponseDTO>> create(
            @Valid @RequestBody BracketTypeRequestDTO requestDTO) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Bracket type created",
                bracketTypeService.createBracketType(requestDTO)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BracketTypeResponseDTO>> update(
            @PathVariable int id,
            @Valid @RequestBody BracketTypeRequestDTO requestDTO) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Bracket type updated",
                bracketTypeService.updateBracketType(id, requestDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable int id) {
        bracketTypeService.deleteBracketType(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bracket type deleted", null));
    }
}
