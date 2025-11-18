package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.OtherMaterialRequestDTO;
import com.aibi.neerp.componentpricing.dto.OtherMaterialResponseDTO;
import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.*;
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
public class OtherMaterialService {

    private final OtherMaterialRepository repository;
    private final OtherMaterialMainRepository otherMaterialMainRepository;
    private final OperatorElevatorRepository operatorElevatorRepository;
    private final TypeOfLiftRepository typeOfLiftRepository;
    private final CapacityTypeRepository capacityTypeRepository;
    private final PersonCapacityRepository personCapacityRepository;
    private final WeightRepository weightRepository;
    private final FloorRepository floorRepository;

    @Transactional(readOnly = true)
    public List<OtherMaterialResponseDTO> findAll() {
        log.info("Fetching all OtherMaterial records in ascending order");

        return repository.findAll(Sort.by(Sort.Order.asc("id")))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse<OtherMaterialResponseDTO> create(OtherMaterialRequestDTO dto) {
        log.info("Creating OtherMaterial: {}", dto.getOtherMaterialMainId());

        OtherMaterial entity = new OtherMaterial();
        applyDto(dto, entity);

        OtherMaterial saved = repository.save(entity);
        return new ApiResponse<>(true, "Other Material created successfully", toResponse(saved));
    }

    @Transactional
    public ApiResponse<OtherMaterialResponseDTO> update(Integer id, OtherMaterialRequestDTO dto) {
        log.info("Updating OtherMaterial id={}", id);

        OtherMaterial entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Other Material not found with ID: " + id));

        applyDto(dto, entity);

        OtherMaterial updated = repository.save(entity);
        return new ApiResponse<>(true, "Other Material updated successfully", toResponse(updated));
    }

    @Transactional
    public ApiResponse<String> delete(Integer id) {
        log.warn("Deleting OtherMaterial id={}", id);

        OtherMaterial entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Other Material not found with ID: " + id));

        repository.delete(entity);
        return new ApiResponse<>(true, "Other Material deleted successfully", null);
    }

    @Transactional(readOnly = true)
    public List<OtherMaterialResponseDTO> searchByLiftTypeAndCapacity(
            Integer operatorId,
            Integer capacityTypeId,
            Integer capacityValueId,
            Integer typeOfLiftId,
            Integer floors) {

        log.info("Searching OtherMaterial by operatorId={}, capacityTypeId={}, capacityValueId={}, typeOfLiftId={} and floors={}",
                operatorId, capacityTypeId, capacityValueId, typeOfLiftId, floors);

        List<OtherMaterial> results = repository.findByOperatorTypeIdAndCapacityTypeIdAndCapacityValueAndMachineRoomIdAndFloorsAndMainType(
                operatorId, capacityTypeId, capacityValueId, typeOfLiftId, floors,"Machines"
        );

        if (results.isEmpty()) {
            log.warn("No OtherMaterial found for given criteria");
        }

        return results.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OtherMaterialResponseDTO> findByOtherMaterialMainId(Long otherMaterialMainId) {
        log.info("Fetching OtherMaterial by OtherMaterialMainId={}", otherMaterialMainId);

        List<OtherMaterial> materials = repository.findByOtherMaterialMainId(otherMaterialMainId);
        if (materials.isEmpty()) {
            log.warn("No OtherMaterial found for OtherMaterialMainId={}", otherMaterialMainId);
        }

        return materials.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OtherMaterialResponseDTO> findByOperatorIdExcludingOthers(Integer operatorId) {
        log.info("Fetching OtherMaterial for operatorId={} excluding mainType='Others'", operatorId);

        List<OtherMaterial> materials = repository.findByOperatorIdExcludingOthers(operatorId);

        if (materials.isEmpty()) {
            log.warn("No OtherMaterial found for operatorId={} excluding Others", operatorId);
        }

        return materials.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


    private void applyDto(OtherMaterialRequestDTO dto, OtherMaterial entity) {
        // Material Type (Required)
        if (dto.getOtherMaterialMainId() != null) {
            entity.setOtherMaterialMain(
                    otherMaterialMainRepository.findById(dto.getOtherMaterialMainId())
                            .orElseThrow(() -> new ResourceNotFoundException("Material main type not found"))
            );
        } else {
            throw new IllegalArgumentException("Material main type is required");
        }

        // Other Material Name (Required)
        if (dto.getOtherMaterialName() != null && !dto.getOtherMaterialName().trim().isEmpty()) {
            entity.setOtherMaterialName(Encode.forHtmlContent(dto.getOtherMaterialName().trim()));
        } else {
            throw new IllegalArgumentException("Other Material Name is required");
        }

        // ✅ Other Material Display Name (Required)
        if (dto.getOtherMaterialDisplayName() != null && !dto.getOtherMaterialDisplayName().trim().isEmpty()) {
            entity.setOtherMaterialDisplayName(Encode.forHtmlContent(dto.getOtherMaterialDisplayName().trim()));
        } else {
            throw new IllegalArgumentException("Other Material Display Name is required");
        }

        // Operator Type
        if (dto.getOperatorTypeId() != null) {
            entity.setOperatorType(operatorElevatorRepository.findById(dto.getOperatorTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Operator Type not found")));
        }

        // Machine Room
        if (dto.getMachineRoomId() != null) {
            entity.setMachineRoom(typeOfLiftRepository.findById(dto.getMachineRoomId())
                    .orElseThrow(() -> new ResourceNotFoundException("Machine Room type not found")));
        }

        // Capacity Type (Required)
        if (dto.getCapacityTypeId() != null) {
            entity.setCapacityType(capacityTypeRepository.findById(dto.getCapacityTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Capacity Type not found")));
        } else {
            entity.setCapacityType(null); // allow null for non-Others
        }

        // Person Capacity
        if (dto.getPersonCapacityId() != null) {
            entity.setPersonCapacity(personCapacityRepository.findById(dto.getPersonCapacityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person Capacity not found")));
        }

        // Weight
        if (dto.getWeightId() != null) {
            entity.setWeight(weightRepository.findById(dto.getWeightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Weight not found")));
        }

        // Floors
        if (dto.getFloorsId() != null) {
            entity.setFloors(floorRepository.findById(Long.valueOf(dto.getFloorsId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Floor not found")));
        }

        // Quantity
        if (dto.getQuantity() != null) {
            entity.setQuantity(Encode.forHtmlContent(dto.getQuantity().trim()));
        }

        // quantityUnit
        if (dto.getQuantityUnit() != null) {
            entity.setQuantityUnit(dto.getQuantityUnit());
        }

        // Price
        entity.setPrice(dto.getPrice());
    }

    private OtherMaterialResponseDTO toResponse(OtherMaterial o) {
        return OtherMaterialResponseDTO.builder()
                .id(o.getId())
                .otherMaterialMainId(o.getOtherMaterialMain() != null ? o.getOtherMaterialMain().getId() : null)
                .otherMaterialMainName(o.getOtherMaterialMain() != null ? o.getOtherMaterialMain().getMaterialMainType() : null)
                .otherMaterialMainActive(o.getOtherMaterialMain() != null ? o.getOtherMaterialMain().getActive() : null)
                .otherMaterialMainRule(o.getOtherMaterialMain() != null ? o.getOtherMaterialMain().getRuleExpression() : null)
                .otherMaterialMainIsSystemDefined(o.getOtherMaterialMain() != null ? o.getOtherMaterialMain().isSystemDefined() : null)
                .otherMaterialName(o.getOtherMaterialName())
                .otherMaterialDisplayName(o.getOtherMaterialDisplayName())

                .operatorTypeId(o.getOperatorType() != null ? o.getOperatorType().getId() : null)
                .operatorTypeName(o.getOperatorType() != null ? o.getOperatorType().getName() : null)

                .machineRoomId(o.getMachineRoom() != null ? o.getMachineRoom().getId() : null)
                .machineRoomName(o.getMachineRoom() != null ? o.getMachineRoom().getLiftTypeName() : null)

                .capacityTypeId(o.getCapacityType() != null ? o.getCapacityType().getId() : null)
                .capacityTypeName(o.getCapacityType() != null ? o.getCapacityType().getType() : null)

                .personCapacityId(o.getPersonCapacity() != null ? o.getPersonCapacity().getId() : null)
                .personCapacityName(o.getPersonCapacity() != null ? o.getPersonCapacity().getDisplayName() : null)

                .weightId(o.getWeight() != null ? o.getWeight().getId() : null)
                .weightName(o.getWeight() != null ? o.getWeight().getWeightValue() + " " + o.getWeight().getUnit().getUnitName() : null)

                .floors(o.getFloors() != null ? o.getFloors().getId() : null)
                .floorsLabel(o.getFloors() != null ? o.getFloors().getFloorName() : null)
                .quantity(o.getQuantity())
                .quantityUnit(o.getQuantityUnit())
                .price(o.getPrice())
                .build();
    }

    @Transactional(readOnly = true)
    public List<OtherMaterialResponseDTO> findByOperatorAndMainTypeContaining(Integer operatorId, String keyword) {
        log.info("Fetching OtherMaterial where mainType contains '{}' and operatorId={}", keyword, operatorId);

        // 1️⃣ Fetch all "Default" materials (operatorType IS NULL)
        List<OtherMaterial> defaultMaterials =
                repository.findByOtherMaterialMain_MaterialMainTypeContainingIgnoreCaseAndOperatorTypeIsNull("Default");

        // 2️⃣ Fetch all "DefaultOperator" materials for this operator
        List<OtherMaterial> operatorSpecificMaterials =
                repository.findByOtherMaterialMain_MaterialMainTypeContainingIgnoreCaseAndOperatorType_Id("DefaultOperator", operatorId);

        // 3️⃣ Combine both lists
        List<OtherMaterial> combined = new java.util.ArrayList<>();
        combined.addAll(defaultMaterials);
        combined.addAll(operatorSpecificMaterials);

        if (combined.isEmpty()) {
            log.warn("No OtherMaterial found for operatorId={} with Default or DefaultOperator types", operatorId);
        }

        return combined.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }



}
