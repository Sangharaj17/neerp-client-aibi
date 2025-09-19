package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.CounterWeightRequestDTO;
import com.aibi.neerp.componentpricing.dto.CounterWeightResponseDTO;
import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.CounterWeightRepository;
import com.aibi.neerp.componentpricing.repository.CounterFrameTypeRepository;
import com.aibi.neerp.componentpricing.repository.TypeOfLiftRepository;
import com.aibi.neerp.componentpricing.repository.FloorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.owasp.encoder.Encode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CounterWeightService {

    private final CounterWeightRepository repository;
    private final TypeOfLiftRepository typeOfLiftRepository;
    private final CounterFrameTypeRepository counterFrameTypeRepository;
    private final FloorRepository floorRepository;

    @Transactional(readOnly = true)
    public List<CounterWeightResponseDTO> findAll() {
        log.info("Fetching all Counter Weights sorted by counterFrameName ASC");
        return repository.findAll()
                .stream()
                .sorted(Comparator.comparing(cw -> cw.getCounterFrameName() == null ? "" : cw.getCounterFrameName(), String.CASE_INSENSITIVE_ORDER))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse<CounterWeightResponseDTO> create(CounterWeightRequestDTO dto) {
        log.info("Creating Counter Weight with Frame Name: {}", dto.getCounterFrameName());

        CounterWeight entity = new CounterWeight();
        entity.setCounterFrameName(sanitize(dto.getCounterFrameName()));
        entity.setTypeOfLift(typeOfLiftRepository.findById(dto.getTypeOfLiftId())
                .orElseThrow(() -> new ResourceNotFoundException("Type of Lift not found")));
        entity.setCounterFrameType(counterFrameTypeRepository.findById(dto.getCounterFrameTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Counter Frame Type not found")));
        entity.setFloors(floorRepository.findById(Long.valueOf(dto.getFloorsId()))
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found")));
        entity.setPrice(dto.getPrice());

        CounterWeight saved = repository.save(entity);
        return new ApiResponse<>(true, "Counter Weight created successfully", mapToResponse(saved));
    }

    @Transactional
    public ApiResponse<CounterWeightResponseDTO> update(Integer id, CounterWeightRequestDTO dto) {
        log.info("Updating Counter Weight with ID: {}", id);

        CounterWeight entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Counter Weight not found"));

        entity.setCounterFrameName(sanitize(dto.getCounterFrameName()));
        entity.setTypeOfLift(typeOfLiftRepository.findById(dto.getTypeOfLiftId())
                .orElseThrow(() -> new ResourceNotFoundException("Type of Lift not found")));
        entity.setCounterFrameType(counterFrameTypeRepository.findById(dto.getCounterFrameTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Counter Frame Type not found")));
        entity.setFloors(floorRepository.findById(Long.valueOf(dto.getFloorsId()))
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found")));
        entity.setPrice(dto.getPrice());

        CounterWeight updated = repository.save(entity);
        return new ApiResponse<>(true, "Counter Weight updated successfully", mapToResponse(updated));
    }

    @Transactional
    public ApiResponse<String> delete(Integer id) {
        log.warn("Deleting Counter Weight with ID: {}", id);

        CounterWeight entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Counter Weight not found"));

        repository.delete(entity);
        return new ApiResponse<>(true, "Counter Weight deleted successfully", null);
    }

    private String sanitize(String input) {
        return input != null ? Encode.forHtmlContent(input.trim()) : null;
    }

    private CounterWeightResponseDTO mapToResponse(CounterWeight entity) {
        return CounterWeightResponseDTO.builder()
                .id(entity.getId())
                .counterFrameName(entity.getCounterFrameName() != null ? Encode.forHtml(entity.getCounterFrameName()) : null)
                .typeOfLiftName(entity.getTypeOfLift().getLiftTypeName())
                .counterFrameTypeName(entity.getCounterFrameType().getFrameTypeName())
                .floorName(entity.getFloors().getFloorName())
                .price(entity.getPrice())
                .build();
    }
}
