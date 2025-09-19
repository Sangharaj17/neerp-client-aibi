package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.dto.NewCounterWeightRequestDTO;
import com.aibi.neerp.componentpricing.dto.NewCounterWeightResponseDTO;
import com.aibi.neerp.componentpricing.entity.NewCounterWeight;
import com.aibi.neerp.componentpricing.entity.CapacityType;
import com.aibi.neerp.componentpricing.entity.PersonCapacity;
import com.aibi.neerp.componentpricing.entity.Weight;
import com.aibi.neerp.componentpricing.repository.NewCounterWeightRepository;
import com.aibi.neerp.componentpricing.repository.CapacityTypeRepository;
import com.aibi.neerp.componentpricing.repository.PersonCapacityRepository;
import com.aibi.neerp.componentpricing.repository.WeightRepository;
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
public class NewCounterWeightService {

    private final NewCounterWeightRepository repository;
    private final CapacityTypeRepository capacityTypeRepository;
    private final PersonCapacityRepository personCapacityRepository;
    private final WeightRepository weightRepository;

    @Transactional(readOnly = true)
    public List<NewCounterWeightResponseDTO> findAll() {
        log.info("Fetching all NewCounterWeight records sorted by name ASC, then id ASC");

        // Sorting handled at DB level
        List<NewCounterWeight> list = repository.findAll(
                Sort.by(
                        Sort.Order.asc("id")
                )
        );

        return list.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse<NewCounterWeightResponseDTO> create(NewCounterWeightRequestDTO dto) {
        log.info("Creating NewCounterWeight: name='{}'", dto.getNewCounterWeightName());

        NewCounterWeight entity = new NewCounterWeight();
        applyDto(dto, entity);

        NewCounterWeight saved = repository.save(entity);
        return new ApiResponse<>(true, "New Counter Weight created successfully", toResponse(saved));
    }

    @Transactional
    public ApiResponse<NewCounterWeightResponseDTO> update(Integer id, NewCounterWeightRequestDTO dto) {
        log.info("Updating NewCounterWeight id={}", id);

        NewCounterWeight entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("New Counter Weight not found with ID: " + id));

        applyDto(dto, entity);

        NewCounterWeight updated = repository.save(entity);
        return new ApiResponse<>(true, "New Counter Weight updated successfully", toResponse(updated));
    }

    @Transactional
    public ApiResponse<String> delete(Integer id) {
        log.warn("Deleting NewCounterWeight id={}", id);

        NewCounterWeight entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("New Counter Weight not found with ID: " + id));

        repository.delete(entity);
        return new ApiResponse<>(true, "New Counter Weight deleted successfully", null);
    }

    /** Map and validate/sanitize incoming DTO onto entity */
    private void applyDto(NewCounterWeightRequestDTO dto, NewCounterWeight entity) {
        // Lookup required capacity type
        CapacityType capType = capacityTypeRepository.findById(dto.getCapacityTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Capacity Type not found with ID: " + dto.getCapacityTypeId()));
        entity.setCapacityType(capType);

        // Conditional associations (either personCapacityId or weightId may be provided depending on capacity type)
        PersonCapacity personCap = null;
        if (dto.getPersonCapacityId() != null) {
            personCap = personCapacityRepository.findById(dto.getPersonCapacityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person Capacity not found with ID: " + dto.getPersonCapacityId()));
        }
        entity.setPersonCapacity(personCap);

        Weight weight = null;
        if (dto.getWeightId() != null) {
            weight = weightRepository.findById(dto.getWeightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Weight not found with ID: " + dto.getWeightId()));
        }
        entity.setWeight(weight);

        // Simple business rule (optional): ensure at least one of personCapacity or weight provided
        if (personCap == null && weight == null) {
            log.error("Validation failed: Either personCapacityId or weightId must be provided");
            throw new IllegalArgumentException("Either Person Capacity or Weight must be provided based on Capacity Type");
        }

        // Sanitize strings
        entity.setNewCounterWeightName(Encode.forHtmlContent(dto.getNewCounterWeightName().trim()));
        entity.setQuantity(Encode.forHtmlContent(dto.getQuantity().trim()));

        // Numbers are validated by annotations on DTO/entity
        entity.setPrice(dto.getPrice());
    }

    private NewCounterWeightResponseDTO toResponse(NewCounterWeight n) {
        Integer capacityTypeId = n.getCapacityType() != null ? n.getCapacityType().getId() : null;
        String capacityTypeName = n.getCapacityType() != null ? n.getCapacityType().getType() : null;

        Integer personCapacityId = n.getPersonCapacity() != null ? n.getPersonCapacity().getId() : null;
        String personCapacityName = n.getPersonCapacity() != null ? n.getPersonCapacity().getDisplayName() : null;

        Integer weightId = n.getWeight() != null ? n.getWeight().getId() : null;
        String weightName = n.getWeight() != null
                ? n.getWeight().getWeightValue() + " " + n.getWeight().getUnit().getUnitName()
                : null;

        return NewCounterWeightResponseDTO.builder()
                .id(n.getId())
                .newCounterWeightName(n.getNewCounterWeightName() != null ? Encode.forHtml(n.getNewCounterWeightName()) : null)
                .capacityTypeId(capacityTypeId)
                .capacityTypeName(capacityTypeName != null ? Encode.forHtml(capacityTypeName) : null)
                .personCapacityId(personCapacityId)
                .personCapacityName(personCapacityName != null ? Encode.forHtml(personCapacityName) : null)
                .weightId(weightId)
                .weightName(weightName != null ? Encode.forHtml(weightName) : null)
                .quantity(n.getQuantity() != null ? Encode.forHtml(n.getQuantity()) : null)
                .price(n.getPrice())
                .build();
    }

}
