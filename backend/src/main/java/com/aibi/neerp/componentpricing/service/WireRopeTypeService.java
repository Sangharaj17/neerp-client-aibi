package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.WireRopeTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.WireRopeTypeResponseDTO;
import com.aibi.neerp.componentpricing.entity.WireRopeType;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.WireRopeTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    @Transactional
    public ApiResponse<WireRopeTypeResponseDTO> createWireRopeType(WireRopeTypeRequestDTO dto) {
        sanitize(dto);

        if (wireRopeTypeRepository.existsByWireRopeTypeIgnoreCase(dto.getWireRopeType())) {
            throw new IllegalArgumentException("Wire Rope Type already exists.");
        }

        WireRopeType type = WireRopeType.builder()
                .wireRopeType(dto.getWireRopeType())
                .build();

        WireRopeType saved = wireRopeTypeRepository.save(type);

        log.info("Created new Wire Rope Type: {}", saved.getId());
        return new ApiResponse<>(true, "Wire Rope Type created successfully", mapToResponse(saved));
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<WireRopeTypeResponseDTO>> getAllWireRopeTypes(String sortBy) {
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
        sanitize(dto);

        WireRopeType type = wireRopeTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wire Rope Type not found"));

        type.setWireRopeType(dto.getWireRopeType());

        WireRopeType saved = wireRopeTypeRepository.save(type);
        log.info("Updated Wire Rope Type ID: {}", id);
        return new ApiResponse<>(true, "Wire Rope Type updated successfully", mapToResponse(saved));
    }

    @Transactional
    public ApiResponse<String> deleteWireRopeType(Long id) {
        WireRopeType type = wireRopeTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wire Rope Type not found"));
        wireRopeTypeRepository.delete(type);
        log.warn("Deleted Wire Rope Type ID: {}", id);
        return new ApiResponse<>(true, "Wire Rope Type deleted successfully", null);
    }

    private void sanitize(WireRopeTypeRequestDTO dto) {
        if (StringUtils.hasText(dto.getWireRopeType())) {
            dto.setWireRopeType(dto.getWireRopeType().trim().toUpperCase());
        } else {
            throw new IllegalArgumentException("Wire Rope Type cannot be empty");
        }
    }

    private WireRopeTypeResponseDTO mapToResponse(WireRopeType type) {
        return WireRopeTypeResponseDTO.builder()
                .id(type.getId())
                .wireRopeType(type.getWireRopeType())
                .build();
    }
}
