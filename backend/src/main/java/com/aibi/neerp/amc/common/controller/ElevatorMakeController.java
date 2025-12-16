package com.aibi.neerp.amc.common.controller;

import com.aibi.neerp.amc.common.dto.ElevatorMakeDto;
import com.aibi.neerp.amc.common.service.ElevatorMakeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amc/common/elevator-makes")
public class ElevatorMakeController {

    private final ElevatorMakeService service;

    public ElevatorMakeController(ElevatorMakeService service) {
        this.service = service;
    }

    @GetMapping
    public List<ElevatorMakeDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ElevatorMakeDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ElevatorMakeDto create(@RequestBody ElevatorMakeDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ElevatorMakeDto update(@PathVariable Long id, @RequestBody ElevatorMakeDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
