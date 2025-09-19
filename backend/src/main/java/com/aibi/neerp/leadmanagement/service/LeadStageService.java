package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.dto.LeadStageDto;
import com.aibi.neerp.leadmanagement.entity.LeadStage;
import com.aibi.neerp.leadmanagement.repository.LeadStageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeadStageService {

    @Autowired
    private LeadStageRepository leadStageRepository;

    public List<LeadStageDto> getAll() {
        return leadStageRepository.findAll().stream()
                .map(stage -> new LeadStageDto(stage.getStageId(), stage.getStageName()))
                .collect(Collectors.toList());
    }

    public LeadStageDto getById(Integer id) {
        LeadStage stage = leadStageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeadStage not found with id: " + id));
        return new LeadStageDto(stage.getStageId(), stage.getStageName());
    }

    public LeadStageDto create(LeadStageDto dto) {
        LeadStage stage = new LeadStage();
        stage.setStageName(dto.getStageName());
        stage = leadStageRepository.save(stage);
        return new LeadStageDto(stage.getStageId(), stage.getStageName());
    }

    public LeadStageDto update(Integer id, LeadStageDto dto) {
        LeadStage existing = leadStageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeadStage not found with id: " + id));
        existing.setStageName(dto.getStageName());
        existing = leadStageRepository.save(existing);
        return new LeadStageDto(existing.getStageId(), existing.getStageName());
    }

    public void delete(Integer id) {
        if (!leadStageRepository.existsById(id)) {
            throw new ResourceNotFoundException("LeadStage not found with id: " + id);
        }
        try {
            leadStageRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot delete lead stage because it's used in other records.");
        }
    }
}
