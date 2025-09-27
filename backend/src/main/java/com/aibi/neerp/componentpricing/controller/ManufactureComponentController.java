package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.ComponentDTO;
import com.aibi.neerp.componentpricing.dto.ManufactureDTO;
import com.aibi.neerp.componentpricing.entity.Manufacture;
import com.aibi.neerp.componentpricing.entity.Component;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.ManufactureComponentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ManufactureComponentController {

    private final ManufactureComponentService service;

    // ------------------ Manufacture ------------------
    @PostMapping("/manufactures")
    public ApiResponse<ManufactureDTO> createManufacture(@RequestBody ManufactureDTO dto) {
        return service.createManufacture(dto);
    }

    //    @GetMapping("/manufactures")
//    public ApiResponse<Map<ManufactureDTO>> getAllManufactures() {
//        return service.getAllManufactures();
//    }
    @GetMapping("/manufactures")
    public ResponseEntity<ApiResponse<Map<Integer, List<ManufactureDTO>>>> getAllManufacturesGrouped() {
        ApiResponse<Map<Integer, List<ManufactureDTO>>> response = service.getAllManufacturesGrouped();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/manufactures/{id}")
    public ApiResponse<ManufactureDTO> updateManufacture(@PathVariable Integer id,
                                                         @RequestBody ManufactureDTO dto) {
        return service.updateManufacture(id, dto);
    }

    @DeleteMapping("/manufactures/{id}")
    public ApiResponse<Void> deleteManufacture(@PathVariable Integer id) {
        return service.deleteManufacture(id);
    }

    // ------------------ Component ------------------
    @PostMapping("/components")
    public ApiResponse<ComponentDTO> createComponent(@RequestBody ComponentDTO dto) {
        return service.createComponent(dto);
    }

    @GetMapping("/components")
    public ApiResponse<List<ComponentDTO>> getAllComponents() {
        return service.getAllComponents();
    }

    @PutMapping("/components/{id}")
    public ApiResponse<ComponentDTO> updateComponent(@PathVariable Integer id,
                                                     @RequestBody ComponentDTO dto) {
        return service.updateComponent(id, dto);
    }

    @DeleteMapping("/components/{id}")
    public ApiResponse<Void> deleteComponent(@PathVariable Integer id) {
        return service.deleteComponent(id);
    }
}
