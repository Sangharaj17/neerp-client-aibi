package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.LoadRequestDTO;
import com.aibi.neerp.componentpricing.dto.LoadResponseDTO;
import com.aibi.neerp.componentpricing.entity.Load;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.LoadRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class LoadService {

    private final LoadRepository loadRepository;

    public LoadService(LoadRepository loadRepository) {
        this.loadRepository = loadRepository;
    }

    @Transactional
    public ApiResponse<LoadResponseDTO> create(LoadRequestDTO dto) {
        log.info("Creating new Load record: {}", dto);

        Load load = Load.builder()
                .loadAmount(dto.getLoadAmount())
                .description(dto.getDescription())
                .build();

        Load saved = loadRepository.save(load);
        return new ApiResponse<>(true, "Load saved successfully", mapToResponse(saved));
    }

    @Transactional
    public ApiResponse<LoadResponseDTO> update(Integer id, LoadRequestDTO dto) {
        log.info("Updating Load with ID: {}", id);

        Load existing = loadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Load not found with ID: " + id));

        existing.setLoadAmount(dto.getLoadAmount());
        existing.setDescription(dto.getDescription());

        Load updated = loadRepository.save(existing);
        return new ApiResponse<>(true, "Load updated successfully", mapToResponse(updated));
    }

    @Transactional
    public ApiResponse<Void> delete(Integer id) {
        log.info("Deleting Load with ID: {}", id);
        Load load = loadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Load not found with ID: " + id));
        loadRepository.delete(load);
        return new ApiResponse<>(true, "Load deleted successfully", null);
    }

    @Transactional
    public ApiResponse<List<LoadResponseDTO>> findAll() {
        log.info("Fetching all Load records");
        List<LoadResponseDTO> loads = loadRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new ApiResponse<>(true, "Load list fetched successfully", loads);
    }

    @Transactional
    public ApiResponse<LoadResponseDTO> findById(Integer id) {
        log.info("Fetching Load by ID: {}", id);
        Load load = loadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Load not found with ID: " + id));
        return new ApiResponse<>(true, "Load found successfully", mapToResponse(load));
    }

    private LoadResponseDTO mapToResponse(Load load) {
        return LoadResponseDTO.builder()
                .id(load.getId())
                .loadAmount(load.getLoadAmount())
                .description(load.getDescription())
                .build();
    }
}

