package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.WireRopeTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.WireRopeTypeResponseDTO;
import com.aibi.neerp.componentpricing.entity.OperatorElevator;
import com.aibi.neerp.componentpricing.entity.TypeOfLift;
import com.aibi.neerp.componentpricing.entity.WireRopeType;
import com.aibi.neerp.componentpricing.repository.TypeOfLiftRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.WireRopeTypeRepository;
import com.aibi.neerp.componentpricing.repository.OperatorElevatorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WireRopeTypeService {

    private final WireRopeTypeRepository wireRopeTypeRepository;
    @Autowired
    private TypeOfLiftRepository typeOfLiftRepository;

    @Transactional
    public ApiResponse<WireRopeTypeResponseDTO> createWireRopeType(WireRopeTypeRequestDTO dto) {
        // Validation and sanitization for the name part
        sanitizeWireRopeType(dto);

        // Ensure wireRopeSize is properly checked (it's checked by @NotNull/@Positive in DTO)

        // UPDATED: Check for existence using the combination of three fields
        if (wireRopeTypeRepository.existsByMachineTypeIdAndWireRopeSizeAndWireRopeTypeIgnoreCase(
                dto.getMachineTypeId(),
                dto.getWireRopeSize(),
                dto.getWireRopeType())) {
            throw new IllegalArgumentException("Wire Rope Type with this Operator, Size, and Name combination already exists.");
        }

        TypeOfLift machineType = typeOfLiftRepository.findById(dto.getMachineTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Machine Type not found with ID: " + dto.getMachineTypeId()));

        WireRopeType type = WireRopeType.builder()
                .machineType(machineType)
                .wireRopeSize(dto.getWireRopeSize())
                .wireRopeType(dto.getWireRopeType())
                .build();

        WireRopeType saved = wireRopeTypeRepository.save(type);

        log.info("Created new Wire Rope Type: {}", saved.getId());
        return new ApiResponse<>(true, "Wire Rope Type created successfully", mapToResponse(saved));
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<WireRopeTypeResponseDTO>> getAllWireRopeTypes(String sortBy) {
        // Note: You may need a DTO mapper here that resolves the OperatorTypeName for the UI.
        List<WireRopeType> list = wireRopeTypeRepository.findAll(
                Sort.by(Sort.Direction.ASC, sortBy != null ? sortBy : "id")
        );
        List<WireRopeTypeResponseDTO> dtos = list.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new ApiResponse<>(true, "Wire Rope Type list fetched", dtos);
    }

    @Transactional
    public ApiResponse<WireRopeTypeResponseDTO> updateWireRopeType(Long id, WireRopeTypeRequestDTO dto) {
        sanitizeWireRopeType(dto);

        WireRopeType type = wireRopeTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wire Rope Type not found"));

        TypeOfLift machineType = typeOfLiftRepository.findById(dto.getMachineTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Machine Type not found with ID: " + dto.getMachineTypeId()));


        if (wireRopeTypeRepository.existsByMachineType_IdAndWireRopeSizeAndWireRopeTypeIgnoreCaseAndIdIsNot(
                dto.getMachineTypeId(),
                dto.getWireRopeSize(),
                dto.getWireRopeType(),
                id)) { // <-- Crucial: Exclude the ID of the entity being updated

            throw new IllegalArgumentException("Wire Rope Type combination already exists for another entry.");
        }

        // Apply updates
        type.setMachineType(machineType);
        type.setWireRopeSize(dto.getWireRopeSize());
        type.setWireRopeType(dto.getWireRopeType());

        WireRopeType saved = wireRopeTypeRepository.save(type);
        log.info("Updated Wire Rope Type ID: {}", id);
        return new ApiResponse<>(true, "Wire Rope Type updated successfully", mapToResponse(saved));
    }

    @Transactional
    public ApiResponse<String> deleteWireRopeType(Long id) {
        // You should add a check here to ensure the WireRopeType is not in use
        // by any WireRope configuration before deletion.
        WireRopeType type = wireRopeTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wire Rope Type not found"));
        wireRopeTypeRepository.delete(type);
        log.warn("Deleted Wire Rope Type ID: {}", id);
        return new ApiResponse<>(true, "Wire Rope Type deleted successfully", null);
    }

    // UPDATED: Renamed sanitize and focused it only on the String field
    private void sanitizeWireRopeType(WireRopeTypeRequestDTO dto) {
        if (StringUtils.hasText(dto.getWireRopeType())) {
            dto.setWireRopeType(dto.getWireRopeType().trim().toUpperCase());
        } else {
            throw new IllegalArgumentException("Wire Rope Type cannot be empty");
        }
    }

    private WireRopeTypeResponseDTO mapToResponse(WireRopeType type) {
        return WireRopeTypeResponseDTO.builder()
                .id(type.getId())
                .machineTypeId(type.getMachineType().getId()) // NEW
                .wireRopeSize(type.getWireRopeSize())     // NEW
                .wireRopeType(type.getWireRopeType())
                .machineTypeName(type.getMachineType().getLiftTypeName()) // Resolve name if necessary
                .build();
    }
}
