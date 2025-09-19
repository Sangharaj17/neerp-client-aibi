package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.TypeOfLiftRequestDTO;
import com.aibi.neerp.componentpricing.dto.TypeOfLiftResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.TypeOfLiftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/type-of-lift")
@RequiredArgsConstructor
public class TypeOfLiftController {

    private final TypeOfLiftService service;

    @PostMapping
    // Uncomment and adjust @PreAuthorize when you have Spring Security configured
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TypeOfLiftResponseDTO>> create(@Valid @RequestBody TypeOfLiftRequestDTO request) {
        log.info("API call: create TypeOfLift");
        ApiResponse<TypeOfLiftResponseDTO> resp = service.create(request);
        return ResponseEntity.ok(resp);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TypeOfLiftResponseDTO>>> getAll() {
        log.info("API call: getAll TypeOfLift");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TypeOfLiftResponseDTO>> getById(@PathVariable int id) {
        log.info("API call: getById TypeOfLift id={}", id);
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TypeOfLiftResponseDTO>> update(
            @PathVariable int id,
            @Valid @RequestBody TypeOfLiftRequestDTO request) {
        log.info("API call: update TypeOfLift id={}", id);
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable int id) {
        log.info("API call: delete TypeOfLift id={}", id);
        return ResponseEntity.ok(service.delete(id));
    }
}
