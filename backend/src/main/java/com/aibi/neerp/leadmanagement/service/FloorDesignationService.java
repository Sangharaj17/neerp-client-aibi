package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.dto.FloorDesignationDto;
import com.aibi.neerp.leadmanagement.entity.FloorDesignation;
import com.aibi.neerp.leadmanagement.repository.FloorDesignationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FloorDesignationService {

    @Autowired
    private FloorDesignationRepository floorDesignationRepository;

    public List<FloorDesignationDto> getAll() {
        return floorDesignationRepository.findAll().stream()
                .map(entity -> new FloorDesignationDto(entity.getFloorDesignationId(), entity.getName()))
                .collect(Collectors.toList());
    }

    public FloorDesignationDto getById(Integer id) {
        FloorDesignation floorDesignation = floorDesignationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FloorDesignation not found with id: " + id));
        return new FloorDesignationDto(floorDesignation.getFloorDesignationId(), floorDesignation.getName());
    }

    public FloorDesignationDto create(FloorDesignationDto dto) {
        FloorDesignation floorDesignation = new FloorDesignation();
        floorDesignation.setName(dto.getName());
        floorDesignation = floorDesignationRepository.save(floorDesignation);
        return new FloorDesignationDto(floorDesignation.getFloorDesignationId(), floorDesignation.getName());
    }

    public FloorDesignationDto update(Integer id, FloorDesignationDto dto) {
        FloorDesignation existing = floorDesignationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FloorDesignation not found with id: " + id));
        existing.setName(dto.getName());
        existing = floorDesignationRepository.save(existing);
        return new FloorDesignationDto(existing.getFloorDesignationId(), existing.getName());
    }

    public void delete(Integer id) {
        if (!floorDesignationRepository.existsById(id)) {
            throw new ResourceNotFoundException("FloorDesignation not found with id: " + id);
        }
        try {
            floorDesignationRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot delete floor designation because it's used in other records.");
        }
    }
}
