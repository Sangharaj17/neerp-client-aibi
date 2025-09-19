package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.dto.LeadSourceDto;
import com.aibi.neerp.leadmanagement.entity.LeadSource;
import com.aibi.neerp.leadmanagement.repository.LeadSourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeadSourceService {

    @Autowired
    private LeadSourceRepository leadSourceRepository;

    public List<LeadSourceDto> getAllLeadSources() {
        return leadSourceRepository.findAll()
                .stream()
                .map(source -> new LeadSourceDto(source.getLeadSourceId(), source.getSourceName()))
                .collect(Collectors.toList());
    }

    public Page<LeadSourceDto> getLeadSourcesPaginated(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("leadSourceId").descending());

        Page<LeadSource> sourcesPage;
        if (keyword != null && !keyword.isBlank()) {
            sourcesPage = leadSourceRepository.findBySourceNameContainingIgnoreCase(keyword, pageable);
        } else {
            sourcesPage = leadSourceRepository.findAll(pageable);
        }

        return sourcesPage.map(source -> new LeadSourceDto(source.getLeadSourceId(), source.getSourceName()));
    }

    public LeadSourceDto getLeadSourceById(Integer id) {
        LeadSource source = leadSourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeadSource not found with id: " + id));
        return new LeadSourceDto(source.getLeadSourceId(), source.getSourceName());
    }

    public LeadSourceDto createLeadSource(LeadSourceDto dto) {
        LeadSource source = new LeadSource();
        source.setSourceName(dto.getSourceName());
        source = leadSourceRepository.save(source);
        return new LeadSourceDto(source.getLeadSourceId(), source.getSourceName());
    }

    public LeadSourceDto updateLeadSource(Integer id, LeadSourceDto dto) {
        LeadSource existing = leadSourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeadSource not found with id: " + id));
        existing.setSourceName(dto.getSourceName());
        existing = leadSourceRepository.save(existing);
        return new LeadSourceDto(existing.getLeadSourceId(), existing.getSourceName());
    }

    public void deleteLeadSource(Integer id) {
        if (!leadSourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("LeadSource not found with id: " + id);
        }

        try {
            leadSourceRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot delete lead source because it's used in other records.");
        }
    }
}
