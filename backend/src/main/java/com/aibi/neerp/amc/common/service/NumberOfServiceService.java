package com.aibi.neerp.amc.common.service;

import com.aibi.neerp.amc.common.dto.NumberOfServiceDto;
import com.aibi.neerp.amc.common.entity.NumberOfService;
import com.aibi.neerp.amc.common.repository.NumberOfServiceRepository;
import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NumberOfServiceService {

    private final NumberOfServiceRepository repository;

    public NumberOfServiceService(NumberOfServiceRepository repository) {
        this.repository = repository;
    }

    public List<NumberOfServiceDto> getAll() {
        return repository.findAll().stream()
                .map(ns -> new NumberOfServiceDto(ns.getId(), ns.getValue()))
                .collect(Collectors.toList());
    }

    public NumberOfServiceDto getById(Long id) {
        NumberOfService ns = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NumberOfService not found with id: " + id));
        return new NumberOfServiceDto(ns.getId(), ns.getValue());
    }

    public NumberOfServiceDto create(NumberOfServiceDto dto) {
        if (repository.existsByValue(dto.getValue())) {
            throw new RuntimeException("NumberOfService already exists: " + dto.getValue());
        }
        NumberOfService ns = new NumberOfService();
        ns.setValue(dto.getValue());
        ns = repository.save(ns);
        return new NumberOfServiceDto(ns.getId(), ns.getValue());
    }

    public NumberOfServiceDto update(Long id, NumberOfServiceDto dto) {
        NumberOfService existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NumberOfService not found with id: " + id));
        existing.setValue(dto.getValue());
        try {
            existing = repository.save(existing);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot update NumberOfService because of duplicate value or constraint.");
        }
        return new NumberOfServiceDto(existing.getId(), existing.getValue());
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("NumberOfService not found with id: " + id);
        }
        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot delete NumberOfService because it is used in other records.");
        }
    }
}
