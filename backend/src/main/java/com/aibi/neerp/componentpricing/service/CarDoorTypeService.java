package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.CarDoorTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.CarDoorTypeResponseDTO;
import com.aibi.neerp.componentpricing.entity.CarDoorSubType;
import com.aibi.neerp.componentpricing.entity.CarDoorType;
import com.aibi.neerp.componentpricing.entity.OperatorElevator;
import com.aibi.neerp.componentpricing.repository.CarDoorSubTypeRepository;
import com.aibi.neerp.componentpricing.repository.CarDoorTypeRepository;
import com.aibi.neerp.componentpricing.repository.OperatorElevatorRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarDoorTypeService {

    private final CarDoorTypeRepository carDoorTypeRepo;
    private final OperatorElevatorRepository operatorRepo;
    private final CarDoorSubTypeRepository carDoorSubTypeRepo;

    
    @Transactional
    public CarDoorTypeResponseDTO create(CarDoorTypeRequestDTO dto) {
        log.info("Creating CarDoorType with type: {}", dto.getCarDoorType());

        sanitize(dto);

        OperatorElevator operator = operatorRepo.findById(dto.getOperatorElevatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator Elevator not found"));

        CarDoorType entity = new CarDoorType();
        entity.setCarDoorType(dto.getCarDoorType().trim());
        entity.setOperatorElevator(operator);

        CarDoorType saved = carDoorTypeRepo.save(entity);
        return toDTO(saved);
    }

    @Transactional
    public CarDoorTypeResponseDTO update(int id, CarDoorTypeRequestDTO dto) {
        log.info("Updating CarDoorType ID: {}", id);

        sanitize(dto);

        CarDoorType existing = carDoorTypeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car Door Type not found"));

        OperatorElevator newOperator = operatorRepo.findById(dto.getOperatorElevatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator Elevator not found"));

        existing.setCarDoorType(dto.getCarDoorType().trim());
        existing.setOperatorElevator(newOperator);

        // Save CarDoorType first
        CarDoorType savedType = carDoorTypeRepo.save(existing);

        // Update all subtypes linked to this CarDoorType
        List<CarDoorSubType> relatedSubTypes = carDoorSubTypeRepo.findByCarDoorType_CarDoorId(id);
        for (CarDoorSubType subType : relatedSubTypes) {
            subType.setOperatorElevator(newOperator);
        }
        carDoorSubTypeRepo.saveAll(relatedSubTypes);

        log.info("Updated {} subtypes for CarDoorType ID: {}", relatedSubTypes.size(), id);

        return toDTO(savedType);
    }

//    public CarDoorTypeResponseDTO update(int id, CarDoorTypeRequestDTO dto) {
//        log.info("Updating CarDoorType ID: {}", id);
//
//        sanitize(dto);
//
//        CarDoorType existing = carDoorTypeRepo.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Car Door Type not found"));
//
//        OperatorElevator operator = operatorRepo.findById(dto.getOperatorElevatorId())
//                .orElseThrow(() -> new ResourceNotFoundException("Operator Elevator not found"));
//
//        existing.setCarDoorType(dto.getCarDoorType().trim());
//        existing.setOperatorElevator(operator);
//
//        return toDTO(carDoorTypeRepo.save(existing));
//    }

    
    public void delete(int id) {
        log.warn("Deleting CarDoorType ID: {}", id);
        CarDoorType entity = carDoorTypeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car Door Type not found"));
        carDoorTypeRepo.delete(entity);
    }

    
    public CarDoorTypeResponseDTO getById(int id) {
        CarDoorType entity = carDoorTypeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car Door Type not found"));
        return toDTO(entity);
    }

    
    public List<CarDoorTypeResponseDTO> getAll(String sortBy) {
        log.info("Fetching all CarDoorTypes sorted by {}", sortBy);
        return carDoorTypeRepo.findAll(org.springframework.data.domain.Sort.by(sortBy))
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private CarDoorTypeResponseDTO toDTO(CarDoorType entity) {
        return new CarDoorTypeResponseDTO(
                entity.getCarDoorId(),
                entity.getCarDoorType(),
                entity.getOperatorElevator().getId(),
                entity.getOperatorElevator().getName()
        );
    }

    private void sanitize(CarDoorTypeRequestDTO dto) {
        if (!StringUtils.hasText(dto.getCarDoorType())) {
            throw new IllegalArgumentException("Car Door Type is invalid");
        }
        dto.setCarDoorType(dto.getCarDoorType().replaceAll("[^\\w\\s-]", "").trim());
    }

    public List<CarDoorTypeResponseDTO> getByLiftType(Integer operatorElevatorId) {
        log.info("Fetching Car Door Types for OperatorElevator ID {}", operatorElevatorId);

        return carDoorTypeRepo.findByOperatorElevator_Id(operatorElevatorId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

}
