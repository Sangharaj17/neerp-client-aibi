package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.CabinFlooringRequestDTO;
import com.aibi.neerp.componentpricing.dto.CabinFlooringResponseDTO;
import com.aibi.neerp.componentpricing.entity.CabinFlooring;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.CabinFlooringRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CabinFlooringService {

    private final CabinFlooringRepository repository;

    private CabinFlooringResponseDTO mapToDTO(CabinFlooring flooring) {
        CabinFlooringResponseDTO dto = new CabinFlooringResponseDTO();
        dto.setId(flooring.getId());
        dto.setFlooringName(flooring.getFlooringName());
        dto.setPrice(flooring.getPrice());
        return dto;
    }

    private String sanitize(String input) {
        return StringEscapeUtils.escapeHtml4(input.trim());
    }

    
    @Transactional
    public ApiResponse<CabinFlooringResponseDTO> create(CabinFlooringRequestDTO dto) {
        String sanitizedName = sanitize(dto.getFlooringName());

        CabinFlooring flooring = new CabinFlooring();
        flooring.setFlooringName(sanitizedName);
        flooring.setPrice(dto.getPrice());

        CabinFlooring saved = repository.save(flooring);

        log.info("Cabin flooring created with ID: {}", saved.getId());

        return new ApiResponse<>(true, "Cabin Flooring created successfully", mapToDTO(saved));
    }

    
    @Transactional
    public ApiResponse<CabinFlooringResponseDTO> update(int id, CabinFlooringRequestDTO dto) {
        CabinFlooring flooring = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cabin Flooring not found with ID: " + id));

        flooring.setFlooringName(sanitize(dto.getFlooringName()));
        flooring.setPrice(dto.getPrice());

        CabinFlooring updated = repository.save(flooring);

        log.info("Cabin flooring updated with ID: {}", id);

        return new ApiResponse<>(true, "Cabin Flooring updated successfully", mapToDTO(updated));
    }

    
    public ApiResponse<List<CabinFlooringResponseDTO>> findAllSorted() {
        List<CabinFlooring> list = repository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        List<CabinFlooringResponseDTO> dtoList = list.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        log.info("Fetched {} cabin floorings sorted by name", dtoList.size());

        return new ApiResponse<>(true, "Cabin Flooring list fetched", dtoList);
    }

    
    public ApiResponse<CabinFlooringResponseDTO> findById(int id) {
        CabinFlooring flooring = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cabin Flooring not found with ID: " + id));

        log.info("Cabin flooring fetched with ID: {}", id);
        return new ApiResponse<>(true, "Cabin Flooring found", mapToDTO(flooring));
    }

    
    @Transactional
    public ApiResponse<String> delete(int id) {
        CabinFlooring flooring = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cabin Flooring not found with ID: " + id));

        repository.delete(flooring);

        log.warn("Cabin flooring deleted with ID: {}", id);
        return new ApiResponse<>(true, "Cabin Flooring deleted successfully", null);
    }
}
