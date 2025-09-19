package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.dto.AreaDto;
import com.aibi.neerp.leadmanagement.entity.Area;
import com.aibi.neerp.leadmanagement.repository.AreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AreaService {

    @Autowired
    private AreaRepository areaRepository;

    public List<AreaDto> getAll() {
        return areaRepository.findAll().stream()
                .map(area -> new AreaDto(area.getAreaId(), area.getAreaName()))
                .collect(Collectors.toList());
    }

    public AreaDto getById(Integer id) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Area not found with id: " + id));
        return new AreaDto(area.getAreaId(), area.getAreaName());
    }

    public AreaDto create(AreaDto dto) {
        Area area = new Area();
        area.setAreaName(dto.getAreaName());
        area = areaRepository.save(area);
        return new AreaDto(area.getAreaId(), area.getAreaName());
    }

    public AreaDto update(Integer id, AreaDto dto) {
        Area existing = areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Area not found with id: " + id));
        existing.setAreaName(dto.getAreaName());
        existing = areaRepository.save(existing);
        return new AreaDto(existing.getAreaId(), existing.getAreaName());
    }

    public void delete(Integer id) {
        if (!areaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Area not found with id: " + id);
        }
        try {
            areaRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot delete area because it's used in other records.");
        }
    }
}
