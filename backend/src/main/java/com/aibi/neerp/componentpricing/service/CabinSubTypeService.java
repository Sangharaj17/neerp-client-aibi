package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.*;
import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.componentpricing.repository.*;
import com.aibi.neerp.exception.DuplicateResourceException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CabinSubTypeService {

    private final CabinSubTypeRepository subTypeRepository;
    private final CabinTypeRepository cabinTypeRepository;
    private final CapacityTypeRepository capacityTypeRepository;
    private final PersonCapacityRepository personCapacityRepository;
    private final WeightRepository weightRepository;

    public List<CabinSubTypeResponseDTO> getAllCabinSubTypes() {
        log.info("Retrieving all Cabin SubTypes from DB");
        return subTypeRepository.findAll(Sort.by("id").ascending())
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public CabinSubTypeResponseDTO getById(Integer id) {
        log.info("Fetching Cabin SubType by ID: {}", id);
        CabinSubType subType = subTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cabin SubType not found with ID: " + id));
        return mapToResponseDTO(subType);
    }

    @Transactional
    public CabinSubTypeResponseDTO createCabinSubType(CabinSubTypeRequestDTO dto) {
        String sanitizedSubName = dto.getCabinSubName().trim().toUpperCase();
        log.info("Creating Cabin SubType: {}", sanitizedSubName);

        CabinType cabinType = cabinTypeRepository.findById(dto.getCabinTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Cabin Type not found"));

        CapacityType capacityType = capacityTypeRepository.findById(dto.getCapacityTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Capacity Type not found"));

        // Duplicate check
        boolean exists = subTypeRepository.existsByCabinSubNameAndCabinType(sanitizedSubName, cabinType);
        if (exists) {
            log.warn("Duplicate Cabin SubType detected: {}", sanitizedSubName);
            throw new DuplicateResourceException("Cabin SubType already exists for this Cabin Type.");
        }

        CabinSubType subType = new CabinSubType();
        subType.setCabinSubName(sanitizedSubName);
        subType.setCabinType(cabinType);
        subType.setCapacityType(capacityType);
        subType.setPrize(dto.getPrize());

        if (capacityType.getType().equalsIgnoreCase("Person") && dto.getPersonCapacityId() != null) {
            PersonCapacity person = personCapacityRepository.findById(dto.getPersonCapacityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person Capacity not found"));
            subType.setPersonCapacity(person);
        } else if (capacityType.getType().equalsIgnoreCase("Weight") && dto.getWeightId() != null) {
            Weight weight = weightRepository.findById(dto.getWeightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Weight not found"));
            subType.setWeight(weight);
        }

        CabinSubType saved = subTypeRepository.save(subType);
        return mapToResponseDTO(saved);
    }

    @Transactional
    public CabinSubTypeResponseDTO updateCabinSubType(Integer id, CabinSubTypeRequestDTO dto) {
        log.info("Updating Cabin SubType ID: {}", id);
        CabinSubType subType = subTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cabin SubType not found"));

        String updatedName = dto.getCabinSubName().trim().toUpperCase();
        CabinType cabinType = cabinTypeRepository.findById(dto.getCabinTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Cabin Type not found"));
        CapacityType capacityType = capacityTypeRepository.findById(dto.getCapacityTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Capacity Type not found"));

        // Duplicate check (excluding current ID)
        boolean exists = subTypeRepository.existsByCabinSubNameAndCabinTypeAndIdNot(updatedName, cabinType, id);
        if (exists) {
            log.warn("Duplicate Cabin SubType name '{}' for Cabin Type ID {}", updatedName, cabinType.getId());
            throw new DuplicateResourceException("Cabin SubType already exists for this Cabin Type.");
        }

        subType.setCabinSubName(updatedName);
        subType.setCabinType(cabinType);
        subType.setCapacityType(capacityType);
        subType.setPrize(dto.getPrize());
        subType.setPersonCapacity(null);
        subType.setWeight(null);

        if (capacityType.getType().equalsIgnoreCase("Person") && dto.getPersonCapacityId() != null) {
            PersonCapacity person = personCapacityRepository.findById(dto.getPersonCapacityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person Capacity not found"));
            subType.setPersonCapacity(person);
        } else if (capacityType.getType().equalsIgnoreCase("Weight") && dto.getWeightId() != null) {
            Weight weight = weightRepository.findById(dto.getWeightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Weight not found"));
            subType.setWeight(weight);
        }

        CabinSubType updated = subTypeRepository.save(subType);
        return mapToResponseDTO(updated);
    }

    @Transactional
    public void deleteCabinSubType(Integer id) {
        log.warn("Attempting to delete Cabin SubType ID: {}", id);
        CabinSubType subType = subTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cabin SubType not found"));
        subTypeRepository.delete(subType);
    }

    public List<CabinSubTypeResponseDTO> getByCabinTypeId(Integer cabinTypeId) {
        log.info("Fetching Cabin SubTypes for Cabin Type ID: {}", cabinTypeId);
        CabinType type = cabinTypeRepository.findById(cabinTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Cabin Type not found"));
        return subTypeRepository.findByCabinType(type)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<CabinSubTypeResponseDTO> searchByCabinTypeAndCapacity(Integer cabinTypeId, Integer capacityTypeId, Integer capacityValueId) {
        log.info("Searching Cabin SubTypes by cabinTypeId={}, capacityTypeId={}, capacityValueId={}",
                cabinTypeId, capacityTypeId, capacityValueId);

        CabinType cabinType = cabinTypeRepository.findById(cabinTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Cabin Type not found"));
        CapacityType capacityType = capacityTypeRepository.findById(capacityTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Capacity Type not found"));

        List<CabinSubType> results;

        if ("Person".equalsIgnoreCase(capacityType.getType())) {
            results = subTypeRepository.findByCabinTypeAndCapacityTypeAndPersonCapacity_Id(
                    cabinType, capacityType, capacityValueId);
        } else if ("Weight".equalsIgnoreCase(capacityType.getType())) {
            results = subTypeRepository.findByCabinTypeAndCapacityTypeAndWeight_Id(
                    cabinType, capacityType, capacityValueId);
        } else {
            throw new ResourceNotFoundException("Unsupported capacity type: " + capacityType.getType());
        }

        if (results.isEmpty()) {
            log.warn("No Cabin SubTypes found for cabinTypeId={}, capacityTypeId={}, capacityValueId={}",
                    cabinTypeId, capacityTypeId, capacityValueId);
        }

        return results.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }


    private CabinSubTypeResponseDTO mapToResponseDTO(CabinSubType subType) {
        CabinSubTypeResponseDTO dto = new CabinSubTypeResponseDTO();
        dto.setId(subType.getId());
        dto.setCabinSubName(subType.getCabinSubName());
        dto.setPrize(subType.getPrize());

        // CabinType DTO
        CabinType type = subType.getCabinType();
        dto.setCabinTypeDTO(new CabinTypeResponseDTO(type.getId(), type.getCabinType()));

        // CapacityType DTO
        CapacityType cap = subType.getCapacityType();
        dto.setCapacityTypeDTO(new CapacityTypeResponseDTO(
                cap.getId(), cap.getType(), cap.getFieldKey(), cap.getFormKey()
        ));

        // PersonCapacity or Weight
        if (subType.getPersonCapacity() != null) {
            PersonCapacity person = subType.getPersonCapacity();
            dto.setPersonCapacityDTO(new PersonCapResponseDTO(person.getId(), person.getPersonCount(), person.getLabel(), person.getIndividualWeight(), person.getUnit().getId(), person.getCapacityType().getId(), person.getDisplayName()));
        }

        if (subType.getWeight() != null) {
            Weight w = subType.getWeight();
            dto.setWeightDTO(new WeightResponseDTO(
                    w.getId(), w.getUnit().getId(), w.getWeightValue(), cap.getId(), w.getUnit().getUnitName(), w.getWeightValue() +" "+w.getUnit().getUnitName()
            ));
        }

        return dto;
    }

}
