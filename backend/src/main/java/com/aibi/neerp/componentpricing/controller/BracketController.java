package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.BracketRequestDTO;
import com.aibi.neerp.componentpricing.dto.BracketResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.BracketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/brackets")
@RequiredArgsConstructor
public class BracketController {

    private final BracketService bracketService;

    @PostMapping
    public ResponseEntity<ApiResponse<BracketResponseDTO>> createBracket(@Valid @RequestBody BracketRequestDTO request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Bracket created successfully",
                bracketService.createBracket(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BracketResponseDTO>> updateBracket(@PathVariable int id,
                                                                         @Valid @RequestBody BracketRequestDTO request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Bracket updated successfully",
                bracketService.updateBracket(id, request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BracketResponseDTO>>> getAllBrackets(
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched all brackets successfully",
                bracketService.getAllBrackets(sortBy, direction)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BracketResponseDTO>> getBracketById(@PathVariable int id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched bracket successfully",
                bracketService.getBracketById(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteBracket(@PathVariable int id) {
        bracketService.deleteBracket(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bracket deleted successfully", null));
    }

    @GetMapping("/floor/{floorId}")
    public ResponseEntity<ApiResponse<List<BracketResponseDTO>>> getBracketsByFloor(@PathVariable Long floorId) {
        log.info("Fetching brackets for floor ID {}", floorId);
        List<BracketResponseDTO> brackets = bracketService.getBracketsByFloor(floorId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched brackets for floor successfully", brackets));
    }

}
