package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.WireRopeRequestDTO;
import com.aibi.neerp.componentpricing.dto.WireRopeResponseDTO;
import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.owasp.encoder.Encode;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WireRopeService {

    private final WireRopeRepository wireRopeRepository;
    private final WireRopeTypeRepository wireRopeTypeRepository;
    private final OperatorElevatorRepository operatorElevatorRepository;
    private final FloorRepository floorRepository;

    @Transactional(readOnly = true)
    public List<WireRopeResponseDTO> findAll() {
        log.info("Fetching all WireRopes sorted by ID ascending");
        return wireRopeRepository.findAll()
                .stream()
                .sorted((a, b) -> a.getId().compareTo(b.getId()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse<WireRopeResponseDTO> create(WireRopeRequestDTO dto) {
        log.info("Creating new WireRope with Type ID: {}", dto.getWireRopeTypeId());

        WireRope wireRope = new WireRope();
        mapDtoToEntity(dto, wireRope);

        WireRope saved = wireRopeRepository.save(wireRope);
        return new ApiResponse<>(true, "Wire Rope created successfully", mapToResponse(saved));
    }

    @Transactional
    public ApiResponse<WireRopeResponseDTO> update(Integer id, WireRopeRequestDTO dto) {
        log.info("Updating WireRope with ID: {}", id);
        System.out.println(id+"Updating WireRope with ID:");

        WireRope wireRope = wireRopeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wire Rope not found with ID: " + id));

        mapDtoToEntity(dto, wireRope);
        WireRope updated = wireRopeRepository.save(wireRope);

        return new ApiResponse<>(true, "Wire Rope updated successfully", mapToResponse(updated));
    }

    @Transactional
    public ApiResponse<String> delete(Integer id) {
        log.warn("Deleting WireRope with ID: {}", id);

        WireRope wireRope = wireRopeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wire Rope not found with ID: " + id));

        wireRopeRepository.delete(wireRope);
        return new ApiResponse<>(true, "Wire Rope deleted successfully", null);
    }

    private void mapDtoToEntity(WireRopeRequestDTO dto, WireRope entity) {
        WireRopeType type = wireRopeTypeRepository.findById(Long.valueOf(dto.getWireRopeTypeId()))
                .orElseThrow(() -> new ResourceNotFoundException("Wire Rope Type not found"));
        OperatorElevator op = operatorElevatorRepository.findById(dto.getOperatorElevatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator Elevator not found"));
        Floor floor = floorRepository.findById(Long.valueOf(dto.getFloorId()))
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));

        entity.setWireRopeType(type);
        entity.setOperatorElevator(op);
        entity.setFloor(floor);
        entity.setWireRopeQty(dto.getWireRopeQty());
        entity.setPrice(dto.getPrice());
    }

    private WireRopeResponseDTO mapToResponse(WireRope wr) {
        return WireRopeResponseDTO.builder()
                .id(wr.getId())
                .wireRopeTypeId(Integer.valueOf(Encode.forHtml(String.valueOf(wr.getWireRopeType().getId()))))
                .wireRopeTypeName(Encode.forHtml(wr.getWireRopeType().getWireRopeType()))
                .operatorElevatorId(wr.getOperatorElevator().getId())
                .operatorElevatorName(Encode.forHtml(wr.getOperatorElevator().getName()))
                .floorId(wr.getFloor().getId())
                .floorName(Encode.forHtml(wr.getFloor().getFloorName()))
                .wireRopeQty(wr.getWireRopeQty())
                .price(wr.getPrice())
                .build();
    }

    @Transactional(readOnly = true)
    public List<WireRopeResponseDTO> findByFloorId(Long floorId) {
        log.info("Fetching WireRopes for Floor ID: {}", floorId);

        // Verify floor exists (optional but recommended)
        floorRepository.findById(floorId)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with ID: " + floorId));

        return wireRopeRepository.findByFloor_Id(floorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WireRopeResponseDTO> findByFloorAndOperator(Long floorId, Long operatorTypeId) {
        log.info("Fetching WireRopes for Floor ID {} and Operator Type ID {}", floorId, operatorTypeId);

        // Optional validation (recommended)
        floorRepository.findById(floorId)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with ID: " + floorId));

        operatorElevatorRepository.findById(Math.toIntExact(operatorTypeId))
                .orElseThrow(() -> new ResourceNotFoundException("Operator Elevator not found with ID: " + operatorTypeId));

        return wireRopeRepository.findByFloor_IdAndOperatorElevator_Id(floorId, operatorTypeId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


}
