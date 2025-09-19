package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.LandingDoorTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.LandingDoorTypeResponseDTO;
import com.aibi.neerp.componentpricing.entity.LandingDoorSubType;
import com.aibi.neerp.componentpricing.entity.LandingDoorType;
import com.aibi.neerp.componentpricing.entity.OperatorElevator;
import com.aibi.neerp.componentpricing.repository.LandingDoorSubTypeRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.repository.LandingDoorTypeRepository;
import com.aibi.neerp.componentpricing.repository.OperatorElevatorRepository;
import com.aibi.neerp.componentpricing.service.LandingDoorTypeService;
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
public class LandingDoorTypeService {

    private final LandingDoorTypeRepository doorRepo;
    private final OperatorElevatorRepository operatorRepo;
    private final LandingDoorSubTypeRepository landingDoorSubTypeRepo;

    public LandingDoorTypeResponseDTO create(LandingDoorTypeRequestDTO dto) {
        OperatorElevator operator = operatorRepo.findById(dto.getOperatorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found"));

        LandingDoorType entity = new LandingDoorType();
        entity.setDoorType(dto.getDoorType());
        entity.setOperatorElevator(operator);

        doorRepo.save(entity);
        return toDTO(entity);
    }

//    public LandingDoorTypeResponseDTO update(int id, LandingDoorTypeRequestDTO dto) {
//        LandingDoorType entity = doorRepo.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Landing Door Type not found"));
//
//        OperatorElevator operator = operatorRepo.findById(dto.getOperatorTypeId())
//                .orElseThrow(() -> new ResourceNotFoundException("Operator not found"));
//
//        entity.setDoorType(dto.getDoorType());
//        entity.setOperatorElevator(operator);
//
//        doorRepo.save(entity);
//        return toDTO(entity);
//    }

    @Transactional
    public LandingDoorTypeResponseDTO update(int id, LandingDoorTypeRequestDTO dto) {
        log.info("Updating LandingDoorType ID: {}", id);

        // Sanitize if needed
        // sanitize(dto);

        // Fetch LandingDoorType
        LandingDoorType entity = doorRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Landing Door Type not found"));

        // Fetch new operator
        OperatorElevator newOperator = operatorRepo.findById(dto.getOperatorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found"));

        // Update main LandingDoorType
        entity.setDoorType(dto.getDoorType().trim());
        entity.setOperatorElevator(newOperator);

        LandingDoorType savedType = doorRepo.save(entity);

        // 🔹 Update all related subtypes
        List<LandingDoorSubType> relatedSubTypes = landingDoorSubTypeRepo
                .findByLandingDoorType_DoorTypeId(id);

        for (LandingDoorSubType subType : relatedSubTypes) {
            subType.setOperatorElevator(newOperator);
        }
        landingDoorSubTypeRepo.saveAll(relatedSubTypes);

        log.info("Updated {} subtypes for LandingDoorType ID: {}", relatedSubTypes.size(), id);

        return toDTO(savedType);
    }


    public void delete(int id) {
        LandingDoorType entity = doorRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Landing Door Type not found"));
        doorRepo.delete(entity);
    }

    public LandingDoorTypeResponseDTO getById(int id) {
        LandingDoorType entity = doorRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Landing Door Type not found"));
        return toDTO(entity);
    }

    public List<LandingDoorTypeResponseDTO> getAll() {
        return doorRepo.findAll(Sort.by("doorTypeId").ascending())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<LandingDoorTypeResponseDTO> getByOperatorTypeId(int operatorTypeId) {
        return doorRepo.findByOperatorElevator_Id(operatorTypeId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private LandingDoorTypeResponseDTO toDTO(LandingDoorType entity) {
        LandingDoorTypeResponseDTO dto = new LandingDoorTypeResponseDTO();
        dto.setDoorTypeId(entity.getDoorTypeId());
        dto.setDoorType(entity.getDoorType());
        dto.setOperatorTypeId(entity.getOperatorElevator().getId());
        dto.setOperatorTypeName(entity.getOperatorElevator().getName());
        return dto;
    }
}
