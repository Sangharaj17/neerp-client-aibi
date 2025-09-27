package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.entity.LightFitting;
import com.aibi.neerp.exception.DuplicateResourceException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.dto.LightFittingRequestDTO;
import com.aibi.neerp.componentpricing.dto.LightFittingResponseDTO;
import com.aibi.neerp.componentpricing.repository.LightFittingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LightFittingService {

    private final LightFittingRepository repository;


    public LightFittingResponseDTO create(LightFittingRequestDTO request) {
        log.info("Creating LightFitting: {}", request.getName());
        if (repository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("Light fitting '" + request.getName() + "' already exists.");
        }
        LightFitting entity = LightFitting.builder()
                .name(request.getName())
                .price(request.getPrice())
                .build();
        return mapToDTO(repository.save(entity));
    }


    public LightFittingResponseDTO update(Integer id, LightFittingRequestDTO request) {
        log.info("Updating LightFitting id {}", id);
        LightFitting entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Light fitting not found with id " + id));

        if (!entity.getName().equalsIgnoreCase(request.getName())
                && repository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("Light fitting '" + request.getName() + "' already exists.");
        }

        entity.setName(request.getName());
        entity.setPrice(request.getPrice());

        return mapToDTO(repository.save(entity));
    }


    public void delete(Integer id) {
        log.info("Deleting LightFitting id {}", id);
        LightFitting entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Light fitting not found with id " + id));
        repository.delete(entity);
    }


    public LightFittingResponseDTO getById(Integer id) {
        LightFitting entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Light fitting not found with id " + id));
        return mapToDTO(entity);
    }


    public List<LightFittingResponseDTO> getAll() {
        return repository.findAll(Sort.by(Sort.Direction.ASC, "id"))
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    private LightFittingResponseDTO mapToDTO(LightFitting entity) {
        return LightFittingResponseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .price(entity.getPrice())
                .build();
    }
}
