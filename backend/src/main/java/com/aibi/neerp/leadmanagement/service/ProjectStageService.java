package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.dto.ProjectStageDto;
import com.aibi.neerp.leadmanagement.entity.ProjectStage;
import com.aibi.neerp.leadmanagement.repository.ProjectStageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectStageService {

    @Autowired
    private ProjectStageRepository projectStageRepository;

    public List<ProjectStageDto> getAll() {
        return projectStageRepository.findAll().stream()
                .map(stage -> new ProjectStageDto(stage.getId(), stage.getStageName()))
                .collect(Collectors.toList());
    }

    public ProjectStageDto getById(Integer id) {
        ProjectStage stage = projectStageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectStage not found with id: " + id));
        return new ProjectStageDto(stage.getId(), stage.getStageName());
    }

    public ProjectStageDto create(ProjectStageDto dto) {
        ProjectStage stage = new ProjectStage();
        stage.setStageName(dto.getStageName());
        stage = projectStageRepository.save(stage);
        return new ProjectStageDto(stage.getId(), stage.getStageName());
    }

    public ProjectStageDto update(Integer id, ProjectStageDto dto) {
        ProjectStage existing = projectStageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectStage not found with id: " + id));
        existing.setStageName(dto.getStageName());
        existing = projectStageRepository.save(existing);
        return new ProjectStageDto(existing.getId(), existing.getStageName());
    }

    public void delete(Integer id) {
        if (!projectStageRepository.existsById(id)) {
            throw new ResourceNotFoundException("ProjectStage not found with id: " + id);
        }
        try {
            projectStageRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot delete project stage because it's used in other records.");
        }
    }
}
