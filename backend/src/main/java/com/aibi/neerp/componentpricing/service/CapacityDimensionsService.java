package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.CapacityDimensionsRequestDTO;
import com.aibi.neerp.componentpricing.dto.CapacityDimensionsResponseDTO;
import com.aibi.neerp.componentpricing.entity.CapacityDimensions;
import com.aibi.neerp.componentpricing.entity.CapacityType;
import com.aibi.neerp.componentpricing.entity.PersonCapacity;
import com.aibi.neerp.componentpricing.entity.Weight;
import com.aibi.neerp.componentpricing.repository.CapacityDimensionsRepository;
import com.aibi.neerp.componentpricing.repository.CapacityTypeRepository;
import com.aibi.neerp.componentpricing.repository.PersonCapacityRepository;
import com.aibi.neerp.componentpricing.repository.WeightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CapacityDimensionsService {

    private final CapacityDimensionsRepository repository;
    private final CapacityTypeRepository capacityTypeRepository;
    private final PersonCapacityRepository personCapacityRepository;
    private final WeightRepository weightRepository;

    // 🔹 Get All
    public List<CapacityDimensionsResponseDTO> getAllCapacityDimensions() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // 🔹 Get by ID
    public CapacityDimensionsResponseDTO getById(Integer id) {
        CapacityDimensions entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("CapacityDimensions not found with id " + id));
        return mapToDTO(entity);
    }

    // 🔹 Create
    public CapacityDimensionsResponseDTO create(CapacityDimensionsRequestDTO request) {
        CapacityDimensions entity = new CapacityDimensions();
        mapRequestToEntity(request, entity);
        return mapToDTO(repository.save(entity));
    }

    // 🔹 Update
    public CapacityDimensionsResponseDTO update(Integer id, CapacityDimensionsRequestDTO request) {
        CapacityDimensions entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("CapacityDimensions not found with id " + id));
        mapRequestToEntity(request, entity);
        return mapToDTO(repository.save(entity));
    }

    // 🔹 Delete
    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("CapacityDimensions not found with id " + id);
        }
        repository.deleteById(id);
    }

    // 🔹 Find Capacity Dimension by Type + Value
    public CapacityDimensionsResponseDTO findByCapacity(Integer capacityTypeId, Integer capacityValueId) {
        CapacityDimensions entity = null;

        if (capacityTypeId == null || capacityValueId == null) {
            return null;
        }

        // Case 1: Person capacity
        if (capacityTypeRepository.findById(capacityTypeId)
                .map(t -> "Person".equalsIgnoreCase(t.getType()))
                .orElse(false)) {
            entity = repository.findByCapacityTypeIdAndPersonCapacityId(capacityTypeId, capacityValueId)
                    .orElse(null);
        }

        // Case 2: Weight capacity
        if (entity == null) {
            entity = repository.findByCapacityTypeIdAndWeightId(capacityTypeId, capacityValueId)
                    .orElse(null);
        }

        return (entity != null) ? mapToDTO(entity) : null;
    }

    // ====== Helper Methods ======

    private void mapRequestToEntity(CapacityDimensionsRequestDTO request, CapacityDimensions entity) {
        // CapacityType
        if (request.getCapacityTypeId() != null) {
            CapacityType type = capacityTypeRepository.findById(request.getCapacityTypeId())
                    .orElseThrow(() -> new RuntimeException("CapacityType not found"));
            entity.setCapacityType(type);
        }

        // PersonCapacity
        if (request.getPersonCapacityId() != null) {
            PersonCapacity person = personCapacityRepository.findById(request.getPersonCapacityId())
                    .orElseThrow(() -> new RuntimeException("PersonCapacity not found"));
            entity.setPersonCapacity(person);
            entity.setWeight(null); // clear other relation
        }

        // Weight
        if (request.getWeightId() != null) {
            Weight weight = weightRepository.findById(request.getWeightId())
                    .orElseThrow(() -> new RuntimeException("Weight not found"));
            entity.setWeight(weight);
            entity.setPersonCapacity(null); // clear other relation
        }

        entity.setShaftsWidth(request.getShaftsWidth());
        entity.setShaftsDepth(request.getShaftsDepth());
        entity.setReqMachineWidth(request.getReqMachineWidth());
        entity.setReqMachineDepth(request.getReqMachineDepth());
        entity.setCarInternalWidth(request.getCarInternalWidth());
        entity.setCarInternalDepth(request.getCarInternalDepth());
    }

    private CapacityDimensionsResponseDTO mapToDTO(CapacityDimensions entity) {
        CapacityDimensionsResponseDTO dto = new CapacityDimensionsResponseDTO();
        dto.setId(entity.getId());

        if (entity.getCapacityType() != null) {
            dto.setCapacityTypeId(entity.getCapacityType().getId());
            dto.setCapacityTypeName(entity.getCapacityType().getType());
        }

        if (entity.getPersonCapacity() != null) {
            dto.setCapacityValueId(entity.getPersonCapacity().getId());
            dto.setCapacityValue(entity.getPersonCapacity().getDisplayName());
        } else if (entity.getWeight() != null) {
            dto.setCapacityValueId(entity.getWeight().getId());
            dto.setCapacityValue(entity.getWeight().getWeightValue() + " " +
                    entity.getWeight().getUnit().getUnitName());
        }

        dto.setShaftsWidth(entity.getShaftsWidth());
        dto.setShaftsDepth(entity.getShaftsDepth());
        dto.setReqMachineWidth(entity.getReqMachineWidth());
        dto.setReqMachineDepth(entity.getReqMachineDepth());
        dto.setCarInternalWidth(entity.getCarInternalWidth());
        dto.setCarInternalDepth(entity.getCarInternalDepth());

        return dto;
    }
}
