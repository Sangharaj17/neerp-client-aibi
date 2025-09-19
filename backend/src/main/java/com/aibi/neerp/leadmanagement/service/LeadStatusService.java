package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.dto.LeadStatusDto;
import com.aibi.neerp.leadmanagement.entity.LeadStatus;
import com.aibi.neerp.leadmanagement.repository.LeadStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeadStatusService {

    private final LeadStatusRepository leadStatusRepository;

    public LeadStatusDto create(LeadStatusDto dto) {
        LeadStatus leadStatus = LeadStatus.builder()
                .statusName(dto.getStatusName())
                .description(dto.getDescription())
                .build();
        LeadStatus saved = leadStatusRepository.save(leadStatus);
        return mapToDto(saved);
    }

    public LeadStatusDto getById(Integer id) {
        LeadStatus leadStatus = leadStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeadStatus not found with id " + id));
        return mapToDto(leadStatus);
    }

    public List<LeadStatusDto> getAll() {
        return leadStatusRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public LeadStatusDto update(Integer id, LeadStatusDto dto) {
        LeadStatus leadStatus = leadStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeadStatus not found with id " + id));

        leadStatus.setStatusName(dto.getStatusName());
        leadStatus.setDescription(dto.getDescription());

        LeadStatus updated = leadStatusRepository.save(leadStatus);
        return mapToDto(updated);
    }

    public void delete(Integer id) {
        LeadStatus leadStatus = leadStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeadStatus not found with id " + id));
        leadStatusRepository.delete(leadStatus);
    }

    private LeadStatusDto mapToDto(LeadStatus leadStatus) {
        return new LeadStatusDto(
                leadStatus.getId(),
                leadStatus.getStatusName(),
                leadStatus.getDescription()
        );
    }
}
