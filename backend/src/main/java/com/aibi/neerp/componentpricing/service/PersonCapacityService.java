package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.PersonCapRequestDTO;
import com.aibi.neerp.componentpricing.dto.PersonCapResponseDTO;
import com.aibi.neerp.componentpricing.entity.PersonCapacity;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.CapacityTypeRepository;
import com.aibi.neerp.componentpricing.repository.PersonCapacityRepository;
import com.aibi.neerp.componentpricing.repository.UnitRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonCapacityService {

    private final PersonCapacityRepository repository;
    private final UnitRepository unitRepository;
    private final CapacityTypeRepository capacityTypeRepository;

    public ApiResponse<PersonCapResponseDTO> create(PersonCapRequestDTO dto) {
        PersonCapacity pc = mapToEntity(dto);
        pc.setLabel(dto.getLabel() != null && !dto.getLabel().trim().isEmpty() ? dto.getLabel() : "Persons");

        // Calculate total weight = per-person weight * count
        //pc.setWeight(dto.getPersonCount() * dto.getWeight());

        PersonCapacity saved = repository.save(pc);
        return new ApiResponse<>(true, "Person capacity created successfully", mapToResponse(saved));
    }
    
    public ApiResponse<List<PersonCapResponseDTO>> getAll() {
        List<PersonCapResponseDTO> list = repository.findAll(Sort.by("id").ascending())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new ApiResponse<>(true, "List fetched successfully", list);
    }

    public ApiResponse<PersonCapResponseDTO> update(Integer id, PersonCapRequestDTO dto) {
        PersonCapacity pc = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person capacity not found with id " + id));

        pc.setPersonCount(dto.getPersonCount());
        pc.setLabel(dto.getLabel() != null && !dto.getLabel().trim().isEmpty() ? dto.getLabel() : "Persons");
        pc.setIndividualWeight(dto.getIndividualWeight());

        pc.setUnit(unitRepository.findById(dto.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found")));

        pc.setCapacityType(capacityTypeRepository.findById(dto.getCapacityTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Capacity Type not found")));

        return new ApiResponse<>(true, "Person capacity updated successfully", mapToResponse(repository.save(pc)));
    }


    public ApiResponse<Void> delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Person capacity not found with id " + id);
        }
        repository.deleteById(id);
        return new ApiResponse<>(true, "Person capacity deleted successfully", null);
    }

    private PersonCapacity mapToEntity(PersonCapRequestDTO dto) {
        PersonCapacity pc = new PersonCapacity();
        pc.setPersonCount(dto.getPersonCount());
        pc.setLabel(dto.getLabel() != null ? dto.getLabel() : "Persons");
        pc.setIndividualWeight(dto.getIndividualWeight());
        pc.setUnit(unitRepository.findById(dto.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found")));
        pc.setCapacityType(capacityTypeRepository.findById(dto.getCapacityTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Capacity Type not found")));
        return pc;
    }

    private PersonCapResponseDTO mapToResponse(PersonCapacity pc) {
        return new PersonCapResponseDTO(
                pc.getId(),
                pc.getPersonCount(),
                pc.getLabel(),
                pc.getIndividualWeight(),
                pc.getUnit().getId(),
                pc.getCapacityType().getId(),
                pc.getDisplayName()
        );
    }
}

