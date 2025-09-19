package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.entity.LandingDoorSubType;
import com.aibi.neerp.componentpricing.entity.LandingDoorType;
import com.aibi.neerp.componentpricing.entity.OperatorElevator;
import com.aibi.neerp.componentpricing.dto.LandingDoorSubTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.LandingDoorSubTypeResponseDTO;
import com.aibi.neerp.componentpricing.repository.LandingDoorSubTypeRepository;
import com.aibi.neerp.componentpricing.repository.LandingDoorTypeRepository;
import com.aibi.neerp.componentpricing.repository.OperatorElevatorRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LandingDoorSubTypeService {

    private final LandingDoorSubTypeRepository repo;
    private final OperatorElevatorRepository operatorRepo;
    private final LandingDoorTypeRepository doorTypeRepo;

    
    public LandingDoorSubTypeResponseDTO create(LandingDoorSubTypeRequestDTO dto) {
        LandingDoorSubType subtype = mapToEntity(dto, new LandingDoorSubType());
        return mapToDTO(repo.save(subtype));
    }

    
    public LandingDoorSubTypeResponseDTO update(int id, LandingDoorSubTypeRequestDTO dto) {
        LandingDoorSubType existing = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Landing Door SubType not found"));

        LandingDoorSubType updated = mapToEntity(dto, existing);
        return mapToDTO(repo.save(updated));
    }

    
    public List<LandingDoorSubTypeResponseDTO> getAll() {
        return repo.findAll(Sort.by("id").ascending())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    
    public LandingDoorSubTypeResponseDTO getById(int id) {
        LandingDoorSubType subtype = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Landing Door SubType not found"));
        return mapToDTO(subtype);
    }

    
    public void delete(int id) {
        LandingDoorSubType subtype = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Landing Door SubType not found"));
        repo.delete(subtype);
    }

    private LandingDoorSubType mapToEntity(LandingDoorSubTypeRequestDTO dto, LandingDoorSubType entity) {
        OperatorElevator operator = operatorRepo.findById(dto.getOperatorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator Elevator not found"));

        LandingDoorType doorType = doorTypeRepo.findById(dto.getDoorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Landing Door Type not found"));

        entity.setName(dto.getSubType());

        // Handle null or decimal price safely
        if (dto.getPrice() != null) {
            entity.setPrize((int) Math.round(dto.getPrice())); // Or setPrize(dto.getPrice()) if using Double
        } else {
            throw new IllegalArgumentException("Price must not be null");
        }

        // Handle size (String -> Integer) safely
        // Handle optional size (null, empty, or 0 allowed)
        if (dto.getSize() != null && !dto.getSize().toString().trim().isEmpty()) {
            try {
                int parsedSize = Integer.parseInt(dto.getSize().toString().trim());
                entity.setSize(parsedSize); // Set size only if parsing succeeds
            } catch (NumberFormatException e) {
                // Optional: Log warning or rethrow with custom message
                throw new IllegalArgumentException("Invalid size format: must be a number");
            }
        } else {
            entity.setSize(0); // or don't set it at all if 0 means "not applicable"
        }


        entity.setOperatorElevator(operator);
        entity.setLandingDoorType(doorType);

        return entity;
    }


    private LandingDoorSubTypeResponseDTO mapToDTO(LandingDoorSubType entity) {
        LandingDoorSubTypeResponseDTO dto = new LandingDoorSubTypeResponseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setPrize(entity.getPrize());
        dto.setSize(entity.getSize());
        dto.setOperatorTypeId(entity.getOperatorElevator().getId());
        dto.setOperatorTypeName(entity.getOperatorElevator().getName());
        dto.setLandingDoorTypeId(entity.getLandingDoorType().getDoorTypeId());
        dto.setLandingDoorTypeName(entity.getLandingDoorType().getDoorType());
        return dto;
    }
}
