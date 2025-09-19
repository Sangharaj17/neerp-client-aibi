package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.TypeOfLiftRequestDTO;
import com.aibi.neerp.componentpricing.dto.TypeOfLiftResponseDTO;
import com.aibi.neerp.componentpricing.entity.TypeOfLift;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.TypeOfLiftRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
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
public class TypeOfLiftService {

    private final TypeOfLiftRepository repo;

    /**
     * Create new TypeOfLift
     */
    @Transactional
    public ApiResponse<TypeOfLiftResponseDTO> create(TypeOfLiftRequestDTO request) {
        String sanitized = sanitize(request.getLiftTypeName());
        log.info("Creating TypeOfLift: {}", sanitized);

        // duplicate check (case-insensitive)
        if (repo.existsByLiftTypeNameIgnoreCase(sanitized)) {
            log.warn("Attempt to create duplicate TypeOfLift: {}", sanitized);
            return new ApiResponse<>(false, "Lift type already exists", null);
        }

        TypeOfLift entity = new TypeOfLift();
        entity.setLiftTypeName(sanitized);
        TypeOfLift saved = repo.save(entity);
        log.info("TypeOfLift created with id {}", saved.getId());

        return new ApiResponse<>(true, "Lift type created successfully", mapToDto(saved));
    }

    /**
     * Get all sorted by liftTypeName ASC
     */
    public ApiResponse<List<TypeOfLiftResponseDTO>> getAll() {
        log.info("Fetching all TypeOfLift (sorted by name)");
        List<TypeOfLift> list = repo.findAllByOrderByLiftTypeNameAsc();
        List<TypeOfLiftResponseDTO> dtos = list.stream().map(this::mapToDto).collect(Collectors.toList());
        return new ApiResponse<>(true, "Fetched lift types", dtos);
    }

    /**
     * Get by id
     */
    public ApiResponse<TypeOfLiftResponseDTO> getById(int id) {
        log.info("Fetching TypeOfLift by id {}", id);
        TypeOfLift entity = repo.findById(id)
                .orElseThrow(() -> {
                    log.error("TypeOfLift not found with id {}", id);
                    return new ResourceNotFoundException("Lift type not found with id: " + id);
                });
        return new ApiResponse<>(true, "Fetched lift type", mapToDto(entity));
    }

    /**
     * Update
     */
    @Transactional
    public ApiResponse<TypeOfLiftResponseDTO> update(int id, TypeOfLiftRequestDTO request) {
        String sanitized = sanitize(request.getLiftTypeName());
        log.info("Updating TypeOfLift id={} newName={}", id, sanitized);

        TypeOfLift entity = repo.findById(id)
                .orElseThrow(() -> {
                    log.error("Cannot update — TypeOfLift not found id {}", id);
                    return new ResourceNotFoundException("Lift type not found with id: " + id);
                });

        // If name changed, check duplicates
        if (!entity.getLiftTypeName().equalsIgnoreCase(sanitized) && repo.existsByLiftTypeNameIgnoreCase(sanitized)) {
            log.warn("Attempt to rename to duplicate lift type: {}", sanitized);
            return new ApiResponse<>(false, "Another lift type with same name already exists", null);
        }

        entity.setLiftTypeName(sanitized);
        TypeOfLift saved = repo.save(entity);
        log.info("TypeOfLift updated id={}", saved.getId());

        // TODO: if you have dependent entities (subtypes), call a propagation method here to update references.
        // e.g. subtypeService.updateLiftTypeReferences(saved);

        return new ApiResponse<>(true, "Lift type updated successfully", mapToDto(saved));
    }

    /**
     * Delete
     */
    @Transactional
    public ApiResponse<String> delete(int id) {
        log.info("Deleting TypeOfLift id={}", id);
        TypeOfLift entity = repo.findById(id)
                .orElseThrow(() -> {
                    log.error("Cannot delete — TypeOfLift not found id {}", id);
                    return new ResourceNotFoundException("Lift type not found with id: " + id);
                });

        // Optional: check foreign key constraints before deleting and return helpful message if it's used.
        // Example:
        // if (subtypeRepository.existsByTypeId(id)) {
        //    log.warn("Cannot delete — type in use by subtypes");
        //    throw new IllegalArgumentException("Cannot delete lift type because it is used by other records.");
        // }

        repo.delete(entity);
        log.info("TypeOfLift deleted id={}", id);
        return new ApiResponse<>(true, "Lift type deleted successfully", null);
    }

    /* ----- Helpers ----- */

    private TypeOfLiftResponseDTO mapToDto(TypeOfLift e) {
        TypeOfLiftResponseDTO dto = new TypeOfLiftResponseDTO();
        dto.setId(e.getId());
        dto.setLiftTypeName(e.getLiftTypeName());
        return dto;
    }

    private String sanitize(String input) {
        if (input == null) return null;
        // trim + escape HTML to avoid XSS in UI (stored/displayed)
        return StringEscapeUtils.escapeHtml4(input.trim());
    }
}
