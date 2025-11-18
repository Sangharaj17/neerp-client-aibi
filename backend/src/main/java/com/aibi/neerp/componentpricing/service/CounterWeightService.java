package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.CounterWeightRequestDTO;
import com.aibi.neerp.componentpricing.dto.CounterWeightResponseDTO;
import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.componentpricing.repository.*;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
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
    private final CounterWeightTypeRepository counterWeightTypeRepository;
    private final FloorRepository floorRepository;
    private final OperatorElevatorRepository operatorElevatorRepository;

    @Transactional(readOnly = true)
    public List<CounterWeightResponseDTO> findAll() {
        log.info("Fetching all Counter Weights sorted by id ASC");
        return repository.findAll()
                .stream()
                .sorted(Comparator.comparing(CounterWeight::getId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse<CounterWeightResponseDTO> create(CounterWeightRequestDTO dto) {
        log.info("Creating Counter Weight with Frame Name: {}", dto.getCounterWeightName());

        CounterWeight entity = new CounterWeight();
        //entity.setCounterFrameName(sanitize(dto.getCounterFrameName().trim()));
        entity.setCounterWeightName(dto.getCounterWeightName().trim());
        entity.setCounterWeightType(counterWeightTypeRepository.findById(Long.valueOf(dto.getCounterWeightTypeId()))
                .orElseThrow(() -> new ResourceNotFoundException("Counter Weight Type not found")));
        entity.setOperatorType(operatorElevatorRepository.findById(dto.getOperatorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator Elevator Type not found")));
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

        //entity.setCounterFrameName(sanitize(dto.getCounterFrameName()));
        entity.setCounterWeightName(dto.getCounterWeightName().trim());
        entity.setCounterWeightType(counterWeightTypeRepository.findById(Long.valueOf(dto.getCounterWeightTypeId()))
                .orElseThrow(() -> new ResourceNotFoundException("Counter Weight Type not found")));
        entity.setOperatorType(operatorElevatorRepository.findById(dto.getOperatorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator Elevator Type not found")));
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
                .counterWeightName(entity.getCounterWeightName() != null ? Encode.forHtml(entity.getCounterWeightName()) : null)
                .counterWeightTypeId(Math.toIntExact(entity.getCounterWeightType().getId()))
                .counterWeightTypeName(entity.getCounterWeightType().getName())
                .operatorTypeId(entity.getOperatorType().getId())
                .operatorTypeName(entity.getOperatorType().getName())
                .floorId(entity.getFloors().getId())
                .floorName(entity.getFloors().getFloorName())
                .price(entity.getPrice())
                .build();
    }

    @Transactional(readOnly = true)
    public List<CounterWeightResponseDTO> findByFloor(Long floorId) {
        log.info("Fetching Counter Weights for Floor ID {}", floorId);

        return repository.findByFloors_Id(floorId)
                .stream()
                .sorted(Comparator.comparing(CounterWeight::getId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CounterWeightResponseDTO> findByOperatorTypeAndFloor(Long operatorId, Long floorId) {
        log.info("Fetching Counter Weights for operator {} and Floor ID {}", operatorId, floorId);


        List<CounterWeight> entities = repository.findByOperatorType_IdAndFloors_Id(operatorId, floorId);

        // Map entities to DTOs (assuming you have a proper mapping function/tool)
        return entities.stream()
                .map(this::mapToResponse) // Placeholder for your mapping logic
                .collect(Collectors.toList());

//        return repository.findByOperatorType_IdAndFloors_Id(operatorId, floorId);
//                .stream()
//                .sorted(Comparator.comparing(CounterWeight::getId))
//                .map(this::mapToResponse)
//                .collect(Collectors.toList());
    }
}
