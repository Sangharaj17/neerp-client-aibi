package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.CounterFrameRequestDTO;
import com.aibi.neerp.componentpricing.dto.CounterFrameResponseDTO;
import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.*;
import com.aibi.neerp.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CounterFrameService {

    private final CounterFrameTypeRepository repository;
    private final WireRopeTypeRepository wireRopeTypeRepository;
    private final CapacityTypeRepository capacityTypeRepository;
    private final PersonCapacityRepository personCapacityRepository;
    private final WeightRepository weightRepository;
    private final OperatorElevatorRepository operatorElevatorRepository;

    @Transactional(readOnly = true)
    public List<CounterFrameResponseDTO> findAll() {
        log.info("Fetching all CounterFrame records");
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse<CounterFrameResponseDTO> create(CounterFrameRequestDTO dto) {
        log.info("Creating CounterFrame with typeId={}, capacityTypeId={}, operatorTypeId={}",
                dto.getCounterFrameTypeId(), dto.getCapacityTypeId(), dto.getOperatorTypeId());

        CounterFrameType entity = new CounterFrameType();
        entity.setCounterFrameType(wireRopeTypeRepository.findById(Long.valueOf(dto.getCounterFrameTypeId()))
                .orElseThrow(() -> new ResourceNotFoundException("Wire Rope not found")));
        entity.setCapacityType(capacityTypeRepository.findById(dto.getCapacityTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Capacity Type not found")));
        if (dto.getPersonCapacityId() != null) {
            entity.setPersonCapacity(personCapacityRepository.findById(dto.getPersonCapacityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person Capacity not found")));
        }
        if (dto.getWeightId() != null) {
            entity.setWeight(weightRepository.findById(dto.getWeightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Weight not found")));
        }
        entity.setOperatorElevator(operatorElevatorRepository.findById(dto.getOperatorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator Elevator not found")));
        entity.setPrice(dto.getPrice());

        CounterFrameType saved = repository.save(entity);
        return new ApiResponse<>(true, "Counter Frame created successfully", mapToResponse(saved));
    }

    @Transactional
    public ApiResponse<CounterFrameResponseDTO> update(Integer id, CounterFrameRequestDTO dto) {
        log.info("Updating CounterFrame ID={}", id);

        CounterFrameType entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Counter Frame not found"));

        entity.setCounterFrameType(wireRopeTypeRepository.findById(Long.valueOf(dto.getCounterFrameTypeId()))
                .orElseThrow(() -> new ResourceNotFoundException("Wire Rope not found")));
        entity.setCapacityType(capacityTypeRepository.findById(dto.getCapacityTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Capacity Type not found")));
        if (dto.getPersonCapacityId() != null) {
            entity.setPersonCapacity(personCapacityRepository.findById(dto.getPersonCapacityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person Capacity not found")));
        } else {
            entity.setPersonCapacity(null);
        }
        if (dto.getWeightId() != null) {
            entity.setWeight(weightRepository.findById(dto.getWeightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Weight not found")));
        } else {
            entity.setWeight(null);
        }
        entity.setOperatorElevator(operatorElevatorRepository.findById(dto.getOperatorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator Elevator not found")));
        entity.setPrice(dto.getPrice());

        CounterFrameType updated = repository.save(entity);
        return new ApiResponse<>(true, "Counter Frame updated successfully", mapToResponse(updated));
    }

    @Transactional
    public ApiResponse<String> delete(Integer id) {
        log.warn("Deleting CounterFrame ID={}", id);
        CounterFrameType entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Counter Frame not found"));
        repository.delete(entity);
        return new ApiResponse<>(true, "Counter Frame deleted successfully", null);
    }

    @Transactional(readOnly = true)
    public List<CounterFrameResponseDTO> search(Integer counterFrameTypeId,
                                                Integer capacityTypeId,
                                                Integer capacityValue,
                                                Integer operatorTypeId) {
        log.info("Searching CounterFrame by counterFrameTypeId={}, capacityTypeId={}, capacityValue={}, operatorTypeId={}",
                counterFrameTypeId, capacityTypeId, capacityValue, operatorTypeId);

        List<CounterFrameType> results;

        if (capacityTypeId == 1) { // Person Capacity
            results = repository.findByCounterFrameType_IdAndCapacityType_IdAndPersonCapacity_IdAndOperatorElevator_Id(
                    counterFrameTypeId, capacityTypeId, capacityValue, operatorTypeId
            );
        } else if (capacityTypeId == 2) { // Weight
            results = repository.findByCounterFrameType_IdAndCapacityType_IdAndWeight_IdAndOperatorElevator_Id(
                    counterFrameTypeId, capacityTypeId, capacityValue, operatorTypeId
            );
        } else {
            throw new IllegalArgumentException("Invalid capacityTypeId: " + capacityTypeId);
        }

        return results.stream().map(this::mapToResponse).collect(Collectors.toList());
    }


    private CounterFrameResponseDTO mapToResponse(CounterFrameType entity) {
        return CounterFrameResponseDTO.builder()
                .id(entity.getId())
                .price(entity.getPrice())
                .counterFrameTypeId(Math.toIntExact(entity.getCounterFrameType().getId()))
                .counterFrameTypeName(entity.getCounterFrameType().getWireRopeType())
                .capacityTypeId(entity.getCapacityType().getId())
                .capacityTypeName(entity.getCapacityType().getType())
                .personCapacityId(entity.getPersonCapacity() != null ? entity.getPersonCapacity().getId() : null)
                .personCapacityName(entity.getPersonCapacity() != null ? entity.getPersonCapacity().getDisplayName() : null)
                .weightId(entity.getWeight() != null ? entity.getWeight().getId() : null)
                .weightName(entity.getWeight() != null ? entity.getWeight().getWeightValue() +" "+entity.getWeight().getUnit().getUnitName() : null)
                .operatorTypeId(entity.getOperatorElevator().getId())
                .operatorTypeName(entity.getOperatorElevator().getName())
                .build();
    }
}
