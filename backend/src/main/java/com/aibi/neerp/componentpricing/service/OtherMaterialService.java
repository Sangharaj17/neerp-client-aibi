package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.OtherMaterialRequestDTO;
import com.aibi.neerp.componentpricing.dto.OtherMaterialResponseDTO;
import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.owasp.encoder.Encode;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtherMaterialService {

    private final OtherMaterialRepository repository;
    private final OperatorElevatorRepository operatorElevatorRepository;
    private final TypeOfLiftRepository typeOfLiftRepository;
    private final CapacityTypeRepository capacityTypeRepository;
    private final PersonCapacityRepository personCapacityRepository;
    private final WeightRepository weightRepository;
    private final FloorRepository floorRepository;

    @Transactional(readOnly = true)
    public List<OtherMaterialResponseDTO> findAll() {
        log.info("Fetching all OtherMaterial records in ascending order");

        return repository.findAll(
                        Sort.by(Sort.Order.asc("id"))
                ).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse<OtherMaterialResponseDTO> create(OtherMaterialRequestDTO dto) {
        log.info("Creating OtherMaterial: {}", dto.getMaterialType());

        OtherMaterial entity = new OtherMaterial();
        applyDto(dto, entity);

        OtherMaterial saved = repository.save(entity);
        return new ApiResponse<>(true, "Other Material created successfully", toResponse(saved));
    }

    @Transactional
    public ApiResponse<OtherMaterialResponseDTO> update(Integer id, OtherMaterialRequestDTO dto) {
        log.info("Updating OtherMaterial id={}", id);

        OtherMaterial entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Other Material not found with ID: " + id));

        applyDto(dto, entity);

        OtherMaterial updated = repository.save(entity);
        return new ApiResponse<>(true, "Other Material updated successfully", toResponse(updated));
    }

    @Transactional
    public ApiResponse<String> delete(Integer id) {
        log.warn("Deleting OtherMaterial id={}", id);

        OtherMaterial entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Other Material not found with ID: " + id));

        repository.delete(entity);
        return new ApiResponse<>(true, "Other Material deleted successfully", null);
    }

    private void applyDto(OtherMaterialRequestDTO dto, OtherMaterial entity) {
        // Material Type
        if (dto.getMaterialType() != null) {
            entity.setMaterialType(Encode.forHtmlContent(dto.getMaterialType().trim()));
        }

        // Operator Type
        if (dto.getOperatorTypeId() != null) {
            entity.setOperatorType(operatorElevatorRepository.findById(dto.getOperatorTypeId())
                    .orElseThrow(() -> {
                        log.error("Operator Type not found for ID {}", dto.getOperatorTypeId());
                        return new ResourceNotFoundException("Operator Type not found");
                    }));
        }

        // Machine Room
        if (dto.getMachineRoomId() != null) {
            entity.setMachineRoom(typeOfLiftRepository.findById(dto.getMachineRoomId())
                    .orElseThrow(() -> {
                        log.error("Machine Room type not found for ID {}", dto.getMachineRoomId());
                        return new ResourceNotFoundException("Machine Room type not found");
                    }));
        }

        // Capacity Type (Required)
        entity.setCapacityType(capacityTypeRepository.findById(dto.getCapacityTypeId())
                .orElseThrow(() -> {
                    log.error("Capacity Type not found for ID {}", dto.getCapacityTypeId());
                    return new ResourceNotFoundException("Capacity Type not found");
                }));

        // Person Capacity
        if (dto.getPersonCapacityId() != null) {
            entity.setPersonCapacity(personCapacityRepository.findById(dto.getPersonCapacityId())
                    .orElseThrow(() -> {
                        log.error("Person Capacity not found for ID {}", dto.getPersonCapacityId());
                        return new ResourceNotFoundException("Person Capacity not found");
                    }));
        }

        // Weight
        if (dto.getWeightId() != null) {
            entity.setWeight(weightRepository.findById(dto.getWeightId())
                    .orElseThrow(() -> {
                        log.error("Weight not found for ID {}", dto.getWeightId());
                        return new ResourceNotFoundException("Weight not found");
                    }));
        }

        // Floors
        if (dto.getFloorsId() != null) {
            entity.setFloors(floorRepository.findById(Long.valueOf(dto.getFloorsId()))
                    .orElseThrow(() -> {
                        log.error("Floor not found for ID {}", dto.getFloorsId());
                        return new ResourceNotFoundException("Floor not found");
                    }));
        }

        // Quantity
        if (dto.getQuantity() != null) {
            entity.setQuantity(Encode.forHtmlContent(dto.getQuantity().trim()));
        }

        // Price
        entity.setPrice(dto.getPrice());
    }

    private OtherMaterialResponseDTO toResponse(OtherMaterial o) {
        return OtherMaterialResponseDTO.builder()
                .id(o.getId())
                .materialType(o.getMaterialType())
                .operatorTypeName(o.getOperatorType() != null ? o.getOperatorType().getName() : null)
                .machineRoomName(o.getMachineRoom() != null ? o.getMachineRoom().getLiftTypeName() : null)
                .capacityTypeName(o.getCapacityType() != null ? o.getCapacityType().getType() : null)
                .personCapacityName(o.getPersonCapacity() != null ? o.getPersonCapacity().getDisplayName() : null)
                .weightName(o.getWeight() != null ? o.getWeight().getWeightValue() + " " + o.getWeight().getUnit().getUnitName() : null)
                .floorsLabel(o.getFloors() != null ? o.getFloors().getFloorName() : null)
                .quantity(o.getQuantity())
                .price(o.getPrice())
                .build();
    }
}
