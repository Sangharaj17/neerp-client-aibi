package com.aibi.neerp.amc.materialrepair.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.aibi.neerp.amc.materialrepair.entity.WorkPeriod;
import com.aibi.neerp.amc.materialrepair.repository.WorkPeriodRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor // Generates a constructor for any 'final' fields (Dependency Injection)
public class WorkPeriodService {

    // The 'final' keyword makes Lombok generate the required constructor for injection
    private final WorkPeriodRepository workPeriodRepository;

    public List<WorkPeriod> getAllWorkPeriods() {
        return workPeriodRepository.findAll();
    }

    public Optional<WorkPeriod> getWorkPeriodById(Long id) {
        return workPeriodRepository.findById(id);
    }

    public WorkPeriod createWorkPeriod(WorkPeriod workPeriod) {
        return workPeriodRepository.save(workPeriod);
    }
    
    // ... other business logic methods
    public WorkPeriod updateWorkPeriod(Long id, WorkPeriod workPeriod) {
        WorkPeriod existing = workPeriodRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("WorkPeriod not found with id: " + id));
        
        existing.setName(workPeriod.getName());
        return workPeriodRepository.save(existing);
    }

    public void deleteWorkPeriod(Long id) {
        if (!workPeriodRepository.existsById(id)) {
            throw new IllegalArgumentException("WorkPeriod not found with id: " + id);
        }
        workPeriodRepository.deleteById(id);
    }
}