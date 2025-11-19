package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.WireRopeRequestDTO;
import com.aibi.neerp.componentpricing.dto.WireRopeResponseDTO;
//import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.componentpricing.entity.Floor;
import com.aibi.neerp.componentpricing.entity.TypeOfLift;
import com.aibi.neerp.componentpricing.entity.WireRope;
import com.aibi.neerp.componentpricing.entity.WireRopeType;

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
    private final TypeOfLiftRepository typeOfLiftRepository;
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
        System.out.println(id + "Updating WireRope with ID:");

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
        TypeOfLift machineType = typeOfLiftRepository.findById(dto.getMachineTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Machine Type not found"));
        Floor floor = floorRepository.findById(Long.valueOf(dto.getFloorId()))
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));

        entity.setWireRopeType(type);
        entity.setMachineType(machineType);
        entity.setFloor(floor);
        entity.setWireRopeName(dto.getWireRopeName());
        entity.setWireRopeQty(dto.getWireRopeQty());
        entity.setPrice(dto.getPrice());
    }

    private WireRopeResponseDTO mapToResponse(WireRope wr) {
        return WireRopeResponseDTO.builder()
                .id(wr.getId())
                .wireRopeTypeId(Integer.valueOf(Encode.forHtml(String.valueOf(wr.getWireRopeType().getId()))))
                .wireRopeTypeName(Encode.forHtml(wr.getWireRopeType().getWireRopeType()))
                .wireRopeName(wr.getWireRopeName())
                .wireRopeSize(wr.getWireRopeType().getWireRopeSize())
                .machineTypeId(wr.getMachineType().getId())
                .machineTypeName(Encode.forHtml(wr.getMachineType().getLiftTypeName()))
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
    public List<WireRopeResponseDTO> findByFloorAndMachineType(Long floorId, Integer machineTypeId) {
        // Stage 1: Initial call and input logging
        log.info("Stage 1: Starting fetch for WireRopes.");
        log.info("Input Parameters: Floor ID = {}, Machine Type ID = {}", floorId, machineTypeId);
        System.out.println("Stage 1: Starting fetch for WireRopes.");
        System.out.println("Input Parameters: Floor ID = " + floorId + ", Machine Type ID = " + machineTypeId);

        // Stage 2: Validation Check (Floor)
        log.info("Stage 2: Validating Floor ID {}.", floorId);
        System.out.println("Stage 2: Validating Floor ID " + floorId + ".");
        Floor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with ID: " + floorId));
        log.info("Stage 2 Complete: Floor found (Name: {})", floor.getFloorName());
        System.out.println("Stage 2 Complete: Floor found (Name: " + floor.getFloorName() + ")");

        // Stage 3: Validation Check (Machine Type)
        log.info("Stage 3: Validating Machine Type ID {}.", machineTypeId);
        System.out.println("Stage 3: Validating Machine Type ID " + machineTypeId + ".");
        TypeOfLift machineType = typeOfLiftRepository.findById(machineTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Machine Type not found with ID: " + machineTypeId));
        log.info("Stage 3 Complete: Machine Type found (Name: {})", machineType.getLiftTypeName());
        System.out.println("Stage 3 Complete: Machine Type found (Name: " + machineType.getLiftTypeName() + ")");

        // Stage 4: Repository Call
        log.info("Stage 4: Calling repository method findByFloor_IdAndMachineType_Id({}, {}).", floorId, machineTypeId);
        System.out.println("Stage 4: Calling repository method findByFloor_IdAndMachineType_Id(" + floorId + ", " + machineTypeId + ").");
        List<WireRope> wireRopes = wireRopeRepository.findByFloor_IdAndMachineType_Id(floorId, machineTypeId);
        log.info("Stage 4 Complete: Found {} WireRope entities.", wireRopes.size());
        System.out.println("Stage 4 Complete: Found " + wireRopes.size() + " WireRope entities.");

        // Debugging data before mapping (showing IDs and basic info)
        if (!wireRopes.isEmpty()) {
            wireRopes.forEach(wr -> log.debug("  Entity found: ID {}, RopeName: {}, Size: {}",
                    wr.getId(), wr.getWireRopeName(), wr.getWireRopeType().getWireRopeSize()));
        }


        // Stage 5: Mapping and Collection
        log.info("Stage 5: Mapping entities to DTOs and collecting results.");
        System.out.println("Stage 5: Mapping entities to DTOs and collecting results.");
        List<WireRopeResponseDTO> responseList = wireRopes.stream()
                .map(this::mapToResponse) // Assuming mapToResponse correctly populates wireRopeSize via the relationship
                .collect(Collectors.toList());
        log.info("Stage 5 Complete: Successfully mapped {} DTOs.", responseList.size());
        System.out.println("Stage 5 Complete: Successfully mapped " + responseList.size() + " DTOs.");

        // Stage 6: Final result logging
        if (!responseList.isEmpty()) {
            responseList.forEach(dto -> log.debug("  DTO output: ID {}, RopeName: {}, Size: {}",
                    dto.getId(), dto.getWireRopeName(), dto.getWireRopeSize()));
        }
        log.info("Stage 6: Fetching process completed successfully.");
        System.out.println("Stage 6: Fetching process completed successfully.");

        return responseList;
    }


}
