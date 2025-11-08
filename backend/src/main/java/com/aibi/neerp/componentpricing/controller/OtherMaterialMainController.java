package com.aibi.neerp.componentpricing.controller;

import com.aibi.neerp.componentpricing.dto.OtherMaterialMainRequestDTO;
import com.aibi.neerp.componentpricing.dto.OtherMaterialMainResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.service.OtherMaterialMainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/material-main")
@RequiredArgsConstructor
@Slf4j
public class OtherMaterialMainController {

    private final OtherMaterialMainService service;

    @PostMapping
    public ApiResponse<OtherMaterialMainResponseDTO> create(@RequestBody OtherMaterialMainRequestDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public ApiResponse<List<OtherMaterialMainResponseDTO>> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ApiResponse<OtherMaterialMainResponseDTO> getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public ApiResponse<OtherMaterialMainResponseDTO> update(@PathVariable Long id, @RequestBody OtherMaterialMainRequestDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        return service.delete(id);
    }
}
