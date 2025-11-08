package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.OtherMaterialMainRequestDTO;
import com.aibi.neerp.componentpricing.dto.OtherMaterialMainResponseDTO;
import com.aibi.neerp.componentpricing.entity.OtherMaterialMain;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.OtherMaterialMainRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtherMaterialMainService {

    private final OtherMaterialMainRepository repository;

    // Create
    public ApiResponse<OtherMaterialMainResponseDTO> create(OtherMaterialMainRequestDTO dto) {
        if (repository.existsByMaterialMainTypeIgnoreCase(dto.getMaterialMainType())) {
            throw new IllegalArgumentException("Material Main Type already exists: " + dto.getMaterialMainType());
        }

        OtherMaterialMain entity = OtherMaterialMain.builder()
                .materialMainType(dto.getMaterialMainType())
                .active(dto.getActive() != null ? dto.getActive() : true) // default true
                .ruleExpression(dto.getRuleExpression())
                .build();

        OtherMaterialMain saved = repository.save(entity);
        log.info("Created OtherMaterialMain: {}", saved.getMaterialMainType());

        return new ApiResponse<>(true, "Created successfully", mapToResponse(saved));
    }

    // Get All
    public ApiResponse<List<OtherMaterialMainResponseDTO>> getAll() {
        List<OtherMaterialMainResponseDTO> list = repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new ApiResponse<>(true, "Fetched successfully", list);
    }

    // Get By ID
    public ApiResponse<OtherMaterialMainResponseDTO> getById(Long id) {
        OtherMaterialMain entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OtherMaterialMain not found with id: " + id));
        return new ApiResponse<>(true, "Fetched successfully", mapToResponse(entity));
    }

    // Update
    public ApiResponse<OtherMaterialMainResponseDTO> update(Long id, OtherMaterialMainRequestDTO dto) {
        OtherMaterialMain entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OtherMaterialMain not found with id: " + id));

        entity.setMaterialMainType(dto.getMaterialMainType());
        entity.setActive(dto.getActive() != null ? dto.getActive() : entity.getActive());
        entity.setRuleExpression(dto.getRuleExpression());

        OtherMaterialMain updated = repository.save(entity);
        log.info("Updated OtherMaterialMain with id: {}", id);

        return new ApiResponse<>(true, "Updated successfully", mapToResponse(updated));
    }

    // Delete
    public ApiResponse<Void> delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("OtherMaterialMain not found with id: " + id);
        }
        repository.deleteById(id);
        log.info("Deleted OtherMaterialMain with id: {}", id);

        return new ApiResponse<>(true, "Deleted successfully", null);
    }

    private OtherMaterialMainResponseDTO mapToResponse(OtherMaterialMain entity) {
        return OtherMaterialMainResponseDTO.builder()
                .id(entity.getId())
                .materialMainType(entity.getMaterialMainType())
                .active(entity.getActive())
                .ruleExpression(entity.getRuleExpression())
                .isSystemDefined(entity.isSystemDefined())
                .build();
    }
}
