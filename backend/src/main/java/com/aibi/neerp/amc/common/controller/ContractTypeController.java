package com.aibi.neerp.amc.common.controller;

import com.aibi.neerp.amc.common.dto.*;
import com.aibi.neerp.amc.common.service.ContractTypeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amc/common/contract-types")
public class ContractTypeController {

    private final ContractTypeService service;

    public ContractTypeController(ContractTypeService service) {
        this.service = service;
    }

    @PostMapping
    public ContractTypeResponseDto create(@RequestBody ContractTypeRequestDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ContractTypeResponseDto update(@PathVariable Long id, @RequestBody ContractTypeRequestDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/{id}")
    public ContractTypeResponseDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<ContractTypeResponseDto> getAll() {
        return service.getAll();
    }
}

