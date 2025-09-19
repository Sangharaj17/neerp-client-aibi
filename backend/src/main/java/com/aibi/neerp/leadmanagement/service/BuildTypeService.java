package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.dto.BuildTypeDto;
import com.aibi.neerp.leadmanagement.entity.BuildType;
import com.aibi.neerp.leadmanagement.repository.BuildTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BuildTypeService {

    @Autowired
    private BuildTypeRepository buildTypeRepository;

    public List<BuildTypeDto> getAll() {
        return buildTypeRepository.findAll().stream()
                .map(entity -> new BuildTypeDto(entity.getId(), entity.getName()))
                .collect(Collectors.toList());
    }

    public BuildTypeDto getById(Integer id) {
        BuildType buildType = buildTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BuildType not found with id: " + id));
        return new BuildTypeDto(buildType.getId(), buildType.getName());
    }

    public BuildTypeDto create(BuildTypeDto dto) {
        BuildType buildType = new BuildType();
        buildType.setName(dto.getName());
        buildType = buildTypeRepository.save(buildType);
        return new BuildTypeDto(buildType.getId(), buildType.getName());
    }

    public BuildTypeDto update(Integer id, BuildTypeDto dto) {
        BuildType existing = buildTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BuildType not found with id: " + id));
        existing.setName(dto.getName());
        existing = buildTypeRepository.save(existing);
        return new BuildTypeDto(existing.getId(), existing.getName());
    }

    public void delete(Integer id) {
        if (!buildTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("BuildType not found with id: " + id);
        }
        try {
            buildTypeRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot delete build type because it's used in other records.");
        }
    }
}
