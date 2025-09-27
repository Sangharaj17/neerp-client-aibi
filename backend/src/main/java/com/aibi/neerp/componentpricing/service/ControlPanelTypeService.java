package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.ControlPanelTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.ControlPanelTypeResponseDTO;
import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ControlPanelTypeService {

    private final ControlPanelTypeRepository controlPanelTypeRepository;
    private final TypeOfLiftRepository typeOfLiftRepository;
    private final OperatorElevatorRepository operatorElevatorRepository;
    private final CapacityTypeRepository capacityTypeRepository;
    private final PersonCapacityRepository personCapacityRepository;
    private final WeightRepository weightRepository;

    @Transactional
    public ApiResponse<ControlPanelTypeResponseDTO> create(ControlPanelTypeRequestDTO DTO) {
        log.info("Creating new ControlPanelType: {}", DTO.getControlPanelType());

        // Sanitize input
        String sanitizedName = StringEscapeUtils.escapeHtml4(DTO.getControlPanelType().trim());

        ControlPanelType entity = new ControlPanelType();
        entity.setControlPanelType(sanitizedName);
        entity.setMachineType(typeOfLiftRepository.findById(DTO.getMachineTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Material type not found")));
        entity.setOperatorType(operatorElevatorRepository.findById(DTO.getOperatorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator type not found")));
        entity.setCapacityType(capacityTypeRepository.findById(DTO.getCapacityTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Capacity type not found")));

        if (DTO.getPersonCapacityId() != null) {
            entity.setPersonCapacity(personCapacityRepository.findById(DTO.getPersonCapacityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person capacity not found")));
        }
        if (DTO.getWeightId() != null) {
            entity.setWeight(weightRepository.findById(DTO.getWeightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Weight not found")));
        }
        entity.setPrice(DTO.getPrice());

        ControlPanelType saved = controlPanelTypeRepository.save(entity);
        log.info("ControlPanelType created with ID: {}", saved.getId());

        return new ApiResponse<>(true, "Control panel type created successfully", mapToDTO(saved));
    }

    @Transactional
    public ApiResponse<ControlPanelTypeResponseDTO> update(Integer id, ControlPanelTypeRequestDTO DTO) {
        log.info("Updating ControlPanelType ID: {}", id);
        ControlPanelType existing = controlPanelTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Control panel type not found"));

        String sanitizedName = StringEscapeUtils.escapeHtml4(DTO.getControlPanelType().trim());
        existing.setControlPanelType(sanitizedName);
        existing.setMachineType(typeOfLiftRepository.findById(DTO.getMachineTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Material type not found")));
        existing.setOperatorType(operatorElevatorRepository.findById(DTO.getOperatorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator type not found")));
        existing.setCapacityType(capacityTypeRepository.findById(DTO.getCapacityTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Capacity type not found")));

        if (DTO.getPersonCapacityId() != null) {
            existing.setPersonCapacity(personCapacityRepository.findById(DTO.getPersonCapacityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person capacity not found")));
        } else {
            existing.setPersonCapacity(null);
        }

        if (DTO.getWeightId() != null) {
            existing.setWeight(weightRepository.findById(DTO.getWeightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Weight not found")));
        } else {
            existing.setWeight(null);
        }

        existing.setPrice(DTO.getPrice());

        ControlPanelType updated = controlPanelTypeRepository.save(existing);
        log.info("ControlPanelType updated with ID: {}", updated.getId());

        return new ApiResponse<>(true, "Control panel type updated successfully", mapToDTO(updated));
    }

    public ApiResponse<List<ControlPanelTypeResponseDTO>> getAll(String sortBy, String direction) {
        log.info("Fetching all ControlPanelTypes sorted by {} {}", sortBy, direction);
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        List<ControlPanelTypeResponseDTO> result = controlPanelTypeRepository.findAll(sort)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return new ApiResponse<>(true, "Fetched control panel types successfully", result);
    }

    public ApiResponse<String> delete(Integer id) {
        log.warn("Deleting ControlPanelType ID: {}", id);
        ControlPanelType existing = controlPanelTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Control panel type not found"));
        controlPanelTypeRepository.delete(existing);
        return new ApiResponse<>(true, "Control panel type deleted successfully", null);
    }


    public ApiResponse<List<ControlPanelTypeResponseDTO>> search(Integer operatorTypeId,
                                                                 Integer capacityTypeId,
                                                                 Integer machineTypeId,
                                                                 Integer capacityValue) {
        log.info("Searching ControlPanelTypes...");

        List<ControlPanelType> filtered = controlPanelTypeRepository.findAll().stream()
                .filter(cp -> operatorTypeId == null || (cp.getOperatorType() != null && cp.getOperatorType().getId().equals(operatorTypeId)))
                .filter(cp -> capacityTypeId == null || (cp.getCapacityType() != null && cp.getCapacityType().getId().equals(capacityTypeId)))
                .filter(cp -> machineTypeId == null || (cp.getMachineType() != null && cp.getMachineType().getId() == (machineTypeId)))
                .filter(cp -> {
                    if (capacityValue == null) return true;
                    if (capacityTypeId != null) {
                        if (capacityTypeId == 1) { // Person
                            return cp.getPersonCapacity() != null && cp.getPersonCapacity().getId().equals(capacityValue);
                        } else if (capacityTypeId == 2) { // Weight
                            return cp.getWeight() != null && cp.getWeight().getId().equals(capacityValue);
                        }
                    }
                    return false;
                })
                .collect(Collectors.toList());

        List<ControlPanelTypeResponseDTO> result = filtered.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return new ApiResponse<>(true, "Search results fetched successfully", result);
    }


    private ControlPanelTypeResponseDTO mapToDTO(ControlPanelType entity) {
        return new ControlPanelTypeResponseDTO(
                entity.getId(),
                entity.getControlPanelType(),
                entity.getMachineType() != null ? entity.getMachineType().getLiftTypeName() : null,
                entity.getOperatorType() != null ? entity.getOperatorType().getName() : null,
                entity.getCapacityType() != null ? entity.getCapacityType().getType() : null,
                entity.getPersonCapacity() != null ? entity.getPersonCapacity().getDisplayName() : null,
                entity.getWeight() != null ? entity.getWeight().getWeightValue() + " " + entity.getWeight().getUnit().getUnitName() : null,
                entity.getPrice(),
                entity.getMachineType() != null ? entity.getMachineType().getId() : null,
                entity.getOperatorType() != null ? entity.getOperatorType().getId() : null,
                entity.getCapacityType() != null ? entity.getCapacityType().getId() : null,
                entity.getPersonCapacity() != null ? entity.getPersonCapacity().getId() : null,
                entity.getWeight() != null ? entity.getWeight().getId() : null


        );
    }
}
