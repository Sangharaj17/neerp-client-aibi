package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.ArdRequestDTO;
import com.aibi.neerp.componentpricing.dto.ArdResponseDTO;
import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArdService {

    private final ArdRepository ardRepository;
    private final CapacityTypeRepository capacityTypeRepository;
    private final PersonCapacityRepository personCapacityRepository;
    private final WeightRepository weightRepository;
    private final OperatorElevatorRepository operatorElevatorRepository;


    @Transactional
    public ApiResponse<ArdResponseDTO> createArd(ArdRequestDTO dto) {
        log.info("Creating ARD entry with device: {}", dto.getArdDevice());

        Ard ard = new Ard();
        mapDtoToEntity(dto, ard);
        Ard saved = ardRepository.save(ard);

        log.info("ARD saved with ID {}", saved.getId());

        return new ApiResponse<>(true, "ARD created successfully", mapEntityToResponse(saved));
    }

    public ApiResponse<List<ArdResponseDTO>> getAllArdsSorted() {
        log.info("Fetching all ARD entries sorted by device name");
        List<Ard> list = ardRepository.findAllByOrderByIdAsc();
        return new ApiResponse<>(true, "Fetched successfully",
                list.stream().map(this::mapEntityToResponse).collect(Collectors.toList()));
    }

    public ApiResponse<ArdResponseDTO> getArdById(int id) {
        log.info("Fetching ARD by ID {}", id);
        Ard ard = ardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ARD not found with ID: " + id));
        return new ApiResponse<>(true, "Fetched successfully", mapEntityToResponse(ard));
    }

    @Transactional
    public ApiResponse<ArdResponseDTO> updateArd(int id, ArdRequestDTO dto) {
        log.info("Updating ARD ID {}", id);
        Ard ard = ardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ARD not found with ID: " + id));

       // boolean typeChanged = !ard.getArdDevice().equals(dto.getArdDevice());

        mapDtoToEntity(dto, ard);
        Ard updated = ardRepository.save(ard);

        return new ApiResponse<>(true, "ARD updated successfully", mapEntityToResponse(updated));
    }

    @Transactional
    public ApiResponse<String> deleteArd(int id) {
        log.info("Deleting ARD ID {}", id);
        Ard ard = ardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ARD not found with ID: " + id));
        ardRepository.delete(ard);
        return new ApiResponse<>(true, "ARD deleted successfully", null);
    }

    // Mapping Helpers
    private void mapDtoToEntity(ArdRequestDTO dto, Ard ard) {
        ard.setArdDevice(sanitize(dto.getArdDevice()));
        ard.setPrice(dto.getPrice());

        CapacityType capacityType = capacityTypeRepository.findById(dto.getCapacityTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("CapacityType not found"));
        ard.setCapacityType(capacityType);

        if (dto.getPersonCapacityId() != null) {
            PersonCapacity pc = personCapacityRepository.findById(dto.getPersonCapacityId())
                    .orElseThrow(() -> new ResourceNotFoundException("PersonCapacity not found"));
            ard.setPersonCapacity(pc);
        } else {
            ard.setPersonCapacity(null);
        }

        if (dto.getWeightId() != null) {
            Weight w = weightRepository.findById(dto.getWeightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Weight not found"));
            ard.setWeight(w);
        } else {
            ard.setWeight(null);
        }

        OperatorElevator operator = operatorElevatorRepository.findById(dto.getOperatorElevatorId())
                .orElseThrow(() -> new ResourceNotFoundException("OperatorElevator not found"));
        ard.setOperatorElevator(operator);

    }

    private ArdResponseDTO mapEntityToResponse(Ard ard) {
        ArdResponseDTO dto = new ArdResponseDTO();
        dto.setId(ard.getId());
        dto.setArdDevice(ard.getArdDevice());
        dto.setPrice(ard.getPrice());
        dto.setCapacityTypeName(ard.getCapacityType() != null ? ard.getCapacityType().getType() : null);
        dto.setPersonCapacityName(ard.getPersonCapacity() != null ? ard.getPersonCapacity().getDisplayName() : null);
        dto.setWeightName(ard.getWeight() != null ? (ard.getWeight().getWeightValue()+" "+ard.getWeight().getUnit().getUnitName()) : null);

        if (ard.getCapacityType() != null) {
            dto.setCapacityTypeId(ard.getCapacityType().getId());
            dto.setCapacityTypeName(ard.getCapacityType().getType());
        }
        if (ard.getPersonCapacity() != null) {
            dto.setPersonCapacityId(ard.getPersonCapacity().getId());
            dto.setPersonCapacityName(ard.getPersonCapacity().getDisplayName());
        }
        if (ard.getWeight() != null) {
            dto.setWeightId(ard.getWeight().getId());
            dto.setWeightName(ard.getWeight().getWeightValue()+" "+ard.getWeight().getUnit().getUnitName());
        }
        if (ard.getOperatorElevator() != null) {
            dto.setOperatorElevatorId(ard.getOperatorElevator().getId());
            dto.setOperatorElevatorName(ard.getOperatorElevator().getName());
        }


        return dto;
    }


    public ApiResponse<List<ArdResponseDTO>> findByOperatorTypeAndCapacityValue(
            Integer operatorId,
            Integer capacityTypeId,
            Integer capacityValueId
    ) {
        log.info("Finding ARDs by operatorId={}, capacityTypeId={}, capacityValueId={}", operatorId, capacityTypeId, capacityValueId);

        List<Ard> results;

        if (capacityTypeId == 1) { // Person
            results = ardRepository.findByOperatorElevator_IdAndCapacityType_IdAndPersonCapacity_Id(operatorId, capacityTypeId, capacityValueId);
        } else if (capacityTypeId == 2) { // Weight
            results = ardRepository.findByOperatorElevator_IdAndCapacityType_IdAndWeight_Id(operatorId, capacityTypeId, capacityValueId);
        } else {
            log.warn("Invalid capacityTypeId={}", capacityTypeId);
            return new ApiResponse<>(false, "Invalid capacity type", List.of());
        }

        if (results.isEmpty()) {
            return new ApiResponse<>(false, "No ARD devices found for given operator and capacity", List.of());
        }

        List<ArdResponseDTO> dtoList = results.stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());

        return new ApiResponse<>(true, "Fetched ARDs successfully", dtoList);
    }




    private String sanitize(String input) {
        return StringEscapeUtils.escapeHtml4(input.trim());
    }
}
