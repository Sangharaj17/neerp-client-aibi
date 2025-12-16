package com.aibi.neerp.amc.materialrepair.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.aibi.neerp.amc.materialrepair.entity.WorkPeriod;
import com.aibi.neerp.amc.materialrepair.service.WorkPeriodService;

import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController // Combines @Controller and @ResponseBody
@RequestMapping("/api/amc/workperiods")
@RequiredArgsConstructor // Generates the constructor for workPeriodService
public class WorkPeriodController {

    private final WorkPeriodService workPeriodService;

    // GET /api/workperiods
    @GetMapping
    public List<WorkPeriod> getAll() {
        return workPeriodService.getAllWorkPeriods();
    }

    // GET /api/workperiods/{id}
    @GetMapping("/{id}")
    public ResponseEntity<WorkPeriod> getById(@PathVariable Long id) {
        return workPeriodService.getWorkPeriodById(id)
                .map(ResponseEntity::ok) // Return 200 OK with body if found
                .orElseGet(() -> ResponseEntity.notFound().build()); // Return 404 NOT FOUND
    }

    // POST /api/workperiods
    @PostMapping
    public WorkPeriod create(@RequestBody WorkPeriod workPeriod) {
        return workPeriodService.createWorkPeriod(workPeriod);
    }
    @PutMapping("/{id}")
    public WorkPeriod update(@PathVariable Long id, @RequestBody WorkPeriod workPeriod) {
        return workPeriodService.updateWorkPeriod(id, workPeriod);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        workPeriodService.deleteWorkPeriod(id);
        return ResponseEntity.noContent().build();
    }
}
