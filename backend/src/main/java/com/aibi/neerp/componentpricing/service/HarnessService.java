package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.HarnessRequestDTO;
import com.aibi.neerp.componentpricing.dto.HarnessResponseDTO;
import com.aibi.neerp.componentpricing.entity.Floor;
import com.aibi.neerp.componentpricing.entity.Harness;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.repository.FloorRepository;
import com.aibi.neerp.componentpricing.repository.HarnessRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.owasp.encoder.Encode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HarnessService {

    private final HarnessRepository harnessRepository;
    private final FloorRepository floorRepository;

    @Transactional
    public ApiResponse<HarnessResponseDTO> createHarness(HarnessRequestDTO dto) {
        log.info("Creating harness with name: {}", dto.getName());

        String sanitizedName = Encode.forHtml(dto.getName().trim()); // security sanitization

        Floor floor = floorRepository.findById(Long.valueOf(dto.getFloorId()))
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with ID: " + dto.getFloorId()));

        Harness harness = new Harness();
        harness.setName(sanitizedName);
        harness.setPrice(dto.getPrice());
        harness.setFloor(floor);

        harnessRepository.save(harness);
        log.info("Harness created successfully with ID: {}", harness.getId());

        return new ApiResponse<>(true, "Harness created successfully",
                new HarnessResponseDTO(harness.getId(), harness.getName(), harness.getPrice(), floor.getFloorName(), floor.getId()));
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<HarnessResponseDTO>> getAllHarnessesSorted() {
        log.info("Fetching all harnesses sorted by name");
        List<HarnessResponseDTO> harnessList = harnessRepository.findAll().stream()
                .sorted(Comparator.comparing(Harness::getId))
                .map(h -> new HarnessResponseDTO(h.getId(), h.getName(), h.getPrice(), h.getFloor().getFloorName(), h.getFloor().getId()))
                .collect(Collectors.toList());
        return new ApiResponse<>(true, "Harness list fetched successfully", harnessList);
    }

    @Transactional(readOnly = true)
    public ApiResponse<HarnessResponseDTO> getHarnessById(int id) {
        log.info("Fetching harness by ID: {}", id);
        Harness harness = harnessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Harness not found with ID: " + id));

        return new ApiResponse<>(true, "Harness fetched successfully",
                new HarnessResponseDTO(harness.getId(), harness.getName(), harness.getPrice(), harness.getFloor().getFloorName(), harness.getFloor().getId()));
    }

    @Transactional
    public ApiResponse<HarnessResponseDTO> updateHarness(int id, HarnessRequestDTO dto) {
        log.info("Updating harness ID: {}", id);

        Harness harness = harnessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Harness not found with ID: " + id));

        String sanitizedName = Encode.forHtml(dto.getName().trim());
        harness.setName(sanitizedName);
        harness.setPrice(dto.getPrice());

        Floor floor = floorRepository.findById(Long.valueOf(dto.getFloorId()))
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with ID: " + dto.getFloorId()));
        harness.setFloor(floor);

        harnessRepository.save(harness);
        log.info("Harness updated successfully with ID: {}", harness.getId());

        return new ApiResponse<>(true, "Harness updated successfully",
                new HarnessResponseDTO(harness.getId(), harness.getName(), harness.getPrice(), floor.getFloorName(), floor.getId()));
    }

    @Transactional
    public ApiResponse<String> deleteHarness(int id) {
        log.warn("Deleting harness with ID: {}", id);
        Harness harness = harnessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Harness not found with ID: " + id));
        harnessRepository.delete(harness);
        return new ApiResponse<>(true, "Harness deleted successfully", null);
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<HarnessResponseDTO>> findByFloorDesignation(String floorDesignation) {
        log.info("Searching Harness by floorDesignation: {}", floorDesignation);

        List<HarnessResponseDTO> harnessList = harnessRepository.findByFloor_FloorNameIgnoreCase(floorDesignation).stream()
                .map(h -> new HarnessResponseDTO(
                        h.getId(),
                        h.getName(),
                        h.getPrice(),
                        h.getFloor().getFloorName(),
                        h.getFloor().getId()
                ))
                .collect(Collectors.toList());

        if (harnessList.isEmpty()) {
            log.warn("No Harness found for floorDesignation={}", floorDesignation);
            return new ApiResponse<>(false, "No harness found for " + floorDesignation, harnessList);
        }

        return new ApiResponse<>(true, "Harness fetched successfully", harnessList);
    }

}
