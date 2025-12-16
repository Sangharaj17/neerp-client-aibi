package com.aibi.neerp.amc.common.service;

import com.aibi.neerp.amc.common.dto.ElevatorMakeDto;
import com.aibi.neerp.amc.common.entity.ElevatorMake;
import com.aibi.neerp.amc.common.repository.ElevatorMakeRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ElevatorMakeService {

    private final ElevatorMakeRepository repository;

    public ElevatorMakeService(ElevatorMakeRepository repository) {
        this.repository = repository;
    }

    public List<ElevatorMakeDto> getAll() {
        return repository.findAll().stream()
                .map(em -> new ElevatorMakeDto(em.getId(), em.getName()))
                .collect(Collectors.toList());
    }

    public ElevatorMakeDto getById(Long id) {
        ElevatorMake em = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ElevatorMake not found with id: " + id));
        return new ElevatorMakeDto(em.getId(), em.getName());
    }

    public ElevatorMakeDto create(ElevatorMakeDto dto) {
        if (repository.existsByName(dto.getName())) {
            throw new RuntimeException("ElevatorMake already exists: " + dto.getName());
        }
        ElevatorMake em = new ElevatorMake();
        em.setName(dto.getName());
        em = repository.save(em);
        return new ElevatorMakeDto(em.getId(), em.getName());
    }

    public ElevatorMakeDto update(Long id, ElevatorMakeDto dto) {
        ElevatorMake em = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ElevatorMake not found with id: " + id));
        
        // Check duplication if name changed
        if (!em.getName().equalsIgnoreCase(dto.getName()) && repository.existsByName(dto.getName())) {
             throw new RuntimeException("ElevatorMake already exists: " + dto.getName());
        }

        em.setName(dto.getName());
        em = repository.save(em);
        return new ElevatorMakeDto(em.getId(), em.getName());
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("ElevatorMake not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
