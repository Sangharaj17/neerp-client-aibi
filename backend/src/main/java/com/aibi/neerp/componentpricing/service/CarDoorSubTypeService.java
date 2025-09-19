package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.CarDoorSubTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.CarDoorSubTypeResponseDTO;
import com.aibi.neerp.componentpricing.entity.CarDoorSubType;
import com.aibi.neerp.componentpricing.entity.CarDoorType;
import com.aibi.neerp.componentpricing.entity.OperatorElevator;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.repository.CarDoorSubTypeRepository;
import com.aibi.neerp.componentpricing.repository.CarDoorTypeRepository;
import com.aibi.neerp.componentpricing.repository.OperatorElevatorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarDoorSubTypeService {

    private final CarDoorSubTypeRepository subTypeRepo;
    private final OperatorElevatorRepository operatorRepo;
    private final CarDoorTypeRepository doorTypeRepo;

    
    @Transactional
    public CarDoorSubTypeResponseDTO create(CarDoorSubTypeRequestDTO dto) {
        log.info("Creating CarDoorSubType: {}", dto.getCarDoorSubType());
        sanitize(dto);

        OperatorElevator operator = operatorRepo.findById(dto.getOperatorElevatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator Elevator not found"));

        CarDoorType doorType = doorTypeRepo.findById(dto.getCarDoorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Car Door Type not found"));

        CarDoorSubType subType = new CarDoorSubType();
        subType.setCarDoorSubtype(dto.getCarDoorSubType());
        subType.setOperatorElevator(operator);
        subType.setCarDoorType(doorType);
        subType.setPrice(dto.getPrice());
        subType.setSize(dto.getSize() != null ? dto.getSize() : 0);

        return toDTO(subTypeRepo.save(subType));
    }

    
    @Transactional
    public CarDoorSubTypeResponseDTO update(int id, CarDoorSubTypeRequestDTO dto) {
        log.info("Updating CarDoorSubType ID: {}", id);
        sanitize(dto);

        CarDoorSubType existing = subTypeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car Door SubType not found"));

        OperatorElevator operator = operatorRepo.findById(dto.getOperatorElevatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator Elevator not found"));

        CarDoorType doorType = doorTypeRepo.findById(dto.getCarDoorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Car Door Type not found"));

        existing.setCarDoorSubtype(dto.getCarDoorSubType());
        existing.setOperatorElevator(operator);
        existing.setCarDoorType(doorType);
        existing.setPrice(dto.getPrice());
        existing.setSize(dto.getSize() != null ? dto.getSize() : 0);

        return toDTO(subTypeRepo.save(existing));
    }

    
    public void delete(int id) {
        log.warn("Deleting CarDoorSubType ID: {}", id);
        CarDoorSubType entity = subTypeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car Door SubType not found"));
        subTypeRepo.delete(entity);
    }

    
    public CarDoorSubTypeResponseDTO getById(int id) {
        return subTypeRepo.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Car Door SubType not found"));
    }

    
    public List<CarDoorSubTypeResponseDTO> getAll(String sortBy) {
        log.info("Fetching all CarDoorSubTypes sorted by: {}", sortBy);
        return subTypeRepo.findAll(Sort.by(Sort.Direction.ASC, sortBy))
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private CarDoorSubTypeResponseDTO toDTO(CarDoorSubType entity) {
        return new CarDoorSubTypeResponseDTO(
                entity.getId(),
                entity.getCarDoorSubtype(),
                entity.getOperatorElevator().getId(),
                entity.getOperatorElevator().getName(),
                entity.getCarDoorType().getCarDoorId(),
                entity.getCarDoorType().getCarDoorType(),
                entity.getPrice(),
                entity.getSize()
        );
    }

    private void sanitize(CarDoorSubTypeRequestDTO dto) {
        if (!StringUtils.hasText(dto.getCarDoorSubType())) {
            throw new IllegalArgumentException("Car Door Subtype is invalid");
        }
        dto.setCarDoorSubType(dto.getCarDoorSubType().replaceAll("[^\\w\\s-]", "").trim());
    }
}
