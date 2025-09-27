package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.CopRequestDTO;
import com.aibi.neerp.componentpricing.dto.CopResponseDTO;
import com.aibi.neerp.componentpricing.entity.Cop;
import com.aibi.neerp.componentpricing.entity.Floor;
import com.aibi.neerp.componentpricing.entity.OperatorElevator;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.repository.CopRepository;
import com.aibi.neerp.componentpricing.repository.FloorRepository;
import com.aibi.neerp.componentpricing.repository.OperatorElevatorRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CopService {

    private final CopRepository copRepository;
    private final FloorRepository floorRepository;
    private final OperatorElevatorRepository operatorElevatorRepository;

    @Transactional(readOnly = true)
    public List<CopResponseDTO> findAllSorted() {
        log.info("Fetching all COP records sorted by copName");
        return copRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Cop::getId))
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse<CopResponseDTO> create(CopRequestDTO DTO) {
        String sanitizedCopName = sanitize(DTO.getCopName());

        if (copRepository.existsByCopNameIgnoreCaseAndFloor_IdAndOperatorType_Id(
                sanitizedCopName, DTO.getFloorId(), DTO.getOperatorTypeId())) {
            log.warn("Duplicate COP creation attempt: {}", sanitizedCopName);
            throw new IllegalArgumentException("COP with this name, floor, and operator type already exists");
        }

        Floor floor = floorRepository.findById(Long.valueOf(DTO.getFloorId()))
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));

        OperatorElevator operator = operatorElevatorRepository.findById(DTO.getOperatorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator Type not found"));

        Cop cop = new Cop();
        cop.setCopName(sanitizedCopName);
        cop.setFloor(floor);
        cop.setOperatorType(operator);
        cop.setPrice(DTO.getPrice());
        cop.setCopType(sanitize(DTO.getCopType()));

        copRepository.save(cop);
        log.info("Created new COP with id={}", cop.getId());

        return new ApiResponse<>(true, "COP created successfully", toResponseDTO(cop));
    }

    @Transactional
    public ApiResponse<CopResponseDTO> update(int id, CopRequestDTO DTO) {
        Cop cop = copRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("COP not found"));

        String sanitizedCopName = sanitize(DTO.getCopName());

        if (copRepository.existsByCopNameIgnoreCaseAndFloor_IdAndOperatorType_IdAndIdNot(
                sanitizedCopName, DTO.getFloorId(), DTO.getOperatorTypeId(), id)) {
            log.warn("Duplicate COP update attempt: {}", sanitizedCopName);
            throw new IllegalArgumentException("COP with this name, floor, and operator type already exists");
        }

        Floor floor = floorRepository.findById(Long.valueOf(DTO.getFloorId()))
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));

        OperatorElevator operator = operatorElevatorRepository.findById(DTO.getOperatorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator Type not found"));

        cop.setCopName(sanitizedCopName);
        cop.setFloor(floor);
        cop.setOperatorType(operator);
        cop.setPrice(DTO.getPrice());
        cop.setCopType(sanitize(DTO.getCopType()));

        copRepository.save(cop);
        log.info("Updated COP with id={}", cop.getId());

        return new ApiResponse<>(true, "COP updated successfully", toResponseDTO(cop));
    }

    @Transactional
    public ApiResponse<String> delete(int id) {
        Cop cop = copRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("COP not found"));
        copRepository.delete(cop);
        log.info("Deleted COP with id={}", id);
        return new ApiResponse<>(true, "COP deleted successfully", null);
    }

    @Transactional(readOnly = true)
    public List<CopResponseDTO> search(Integer operatorTypeId, Integer floorId) {
        log.info("Searching COPs... operatorTypeId={}, floorId={}", operatorTypeId, floorId);

        return copRepository.findAll().stream()
                .filter(cop -> operatorTypeId == null ||
                        (cop.getOperatorType() != null &&
                                cop.getOperatorType().getId().equals(operatorTypeId)))
                .filter(cop -> floorId == null ||
                        (cop.getFloor() != null &&
                                cop.getFloor().getId().equals(floorId)))
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }


    private String sanitize(String input) {
        return input == null ? null : input.trim().replaceAll("\\s{2,}", " ");
    }

    private CopResponseDTO toResponseDTO(Cop cop) {
        return new CopResponseDTO(
                cop.getId(),
                cop.getCopName(),
                cop.getPrice(),
                cop.getCopType(),
                cop.getFloor() != null ? cop.getFloor().getId() : null,
                cop.getFloor() != null ? cop.getFloor().getFloorName() : null,
                cop.getOperatorType() != null ? cop.getOperatorType().getId() : null,
                cop.getOperatorType() != null ? cop.getOperatorType().getName() : null
        );
    }
}
