package com.aibi.neerp.componentpricing.service;


import com.aibi.neerp.componentpricing.dto.CounterWeightTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.CounterWeightTypeResponseDTO;
import com.aibi.neerp.componentpricing.entity.CounterWeightType;
import com.aibi.neerp.componentpricing.repository.CounterWeightTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CounterWeightTypeService {

    private final CounterWeightTypeRepository repository;

    public CounterWeightTypeResponseDTO create(CounterWeightTypeRequestDTO dto) {
        if (repository.existsByNameIgnoreCase(dto.getName())) {
            throw new RuntimeException("Counter Weight Type already exists: " + dto.getName());
        }
        CounterWeightType entity = repository.save(
                CounterWeightType.builder().name(dto.getName()).build()
        );
        log.info("Created CounterWeightType: {}", entity.getName());
        return toDTO(entity);
    }

    public List<CounterWeightTypeResponseDTO> findAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CounterWeightTypeResponseDTO findById(Long id) {
        CounterWeightType entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Counter Weight Type not found with id: " + id));
        return toDTO(entity);
    }

    public CounterWeightTypeResponseDTO update(Long id, CounterWeightTypeRequestDTO dto) {
        CounterWeightType entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Counter Weight Type not found with id: " + id));
        entity.setName(dto.getName());
        CounterWeightType updated = repository.save(entity);
        log.info("Updated CounterWeightType ID {} to {}", id, dto.getName());
        return toDTO(updated);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Counter Weight Type not found with id: " + id);
        }
        repository.deleteById(id);
        log.info("Deleted CounterWeightType with ID {}", id);
    }

    private CounterWeightTypeResponseDTO toDTO(CounterWeightType entity) {
        return CounterWeightTypeResponseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }
}
