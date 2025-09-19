package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.entity.Floor;
import com.aibi.neerp.componentpricing.dto.FloorRequestDTO;
import com.aibi.neerp.componentpricing.dto.FloorResponseDTO;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.FloorRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FloorService {

    private final FloorRepository floorRepository;

    /// CREATE - Generate and Save Multiple Floors
    /// Compare TotalFloors with existing count.
    /// Update floor names if the prefix changed.
    /// Add new floors if TotalFloors increased.
    /// Delete extra floors if TotalFloors decreased, but only if they are not referenced (handle foreign key constraints).
    /// If TotalFloors decreased and prefix changed, just update names for existing floors.
    ///
    @Transactional
    public ApiResponse<List<FloorResponseDTO>> generateAndSaveFloors(FloorRequestDTO requestDTO) {
        log.info("Generating/updating floors with request: {}", requestDTO);

        String sanitizedPrefix = sanitize(requestDTO.getPrefix());
        int totalFloors = requestDTO.getTotalFloors();

        List<Floor> existingFloors = floorRepository.findAll(Sort.by(Sort.Order.asc("id")));
        int existingCount = existingFloors.size();

        try {
            List<Floor> updatedFloors = new ArrayList<>();

            // 1️⃣ Update existing floor names if prefix changed
            for (int i = 0; i < Math.min(totalFloors, existingCount); i++) {
                Floor floor = existingFloors.get(i);
                String newName = sanitizedPrefix + (i + 1);
                if (!floor.getFloorName().equals(newName)) {
                    floor.setFloorName(newName);
                }
                updatedFloors.add(floor);
            }

            // 2️⃣ Add new floors if totalFloors > existingCount
            for (int i = existingCount; i < totalFloors; i++) {
                updatedFloors.add(new Floor(sanitizedPrefix + (i + 1)));
            }

            // 3️⃣ Delete extra floors if totalFloors < existingCount
            if (totalFloors < existingCount) {
                List<Floor> floorsToDelete = existingFloors.subList(totalFloors, existingCount);
                for (Floor floor : floorsToDelete) {
                    try {
                        floorRepository.delete(floor);
                    } catch (DataIntegrityViolationException ex) {
                        log.warn("Cannot delete floor {} as it is referenced in other tables", floor.getFloorName());
                        // keep it in updatedFloors
                        updatedFloors.add(floor);
                    }
                }
            }

            // 4️⃣ Save all updated and new floors
            List<Floor> saved = floorRepository.saveAll(updatedFloors);

            log.info("Generated/updated {} floors", saved.size());

            return new ApiResponse<>(true, "Floors generated/updated successfully",
                    saved.stream()
                            .map(f -> new FloorResponseDTO(f.getId(), f.getFloorName()))
                            .collect(Collectors.toList()));

        } catch (Exception ex) {
            log.error("Error generating floors: {}", ex.getMessage());
            return new ApiResponse<>(false, "Failed to generate floors: " + ex.getMessage(), null);
        }
    }

//    @Transactional
//    public ApiResponse<List<FloorResponseDTO>> generateAndSaveFloors(FloorRequestDTO requestDTO) {
//        log.info("Deleting all existing floors before generating new ones");
//        floorRepository.deleteAll();
//
//        // Reset sequence for PostgreSQL
//        floorRepository.resetSequence();
//
//        String sanitizedPrefix = sanitize(requestDTO.getPrefix());
//        List<Floor> floors = new ArrayList<>();
//
//        for (int i = 1; i <= requestDTO.getTotalFloors(); i++) {
//            floors.add(new Floor(sanitizedPrefix + i));
//        }
//
//        List<Floor> saved = floorRepository.saveAll(floors);
//        log.info("Generated {} floors", saved.size());
//
//        return new ApiResponse<>(true, "Floors regenerated successfully",
//                saved.stream()
//                        .map(f -> new FloorResponseDTO(f.getId(), f.getFloorName()))
//                        .collect(Collectors.toList()));
//    }

//    public ApiResponse<List<FloorResponseDTO>> generateAndSaveFloors(FloorRequestDTO requestDTO) {
//        log.info("Generating {} floors with prefix '{}'", requestDTO.getTotalFloors(), requestDTO.getPrefix());
//
//        String sanitizedPrefix = sanitize(requestDTO.getPrefix());
//        List<Floor> floors = new ArrayList<>();
//
//        for (int i = 1; i <= requestDTO.getTotalFloors(); i++) {
//            String floorName = sanitizedPrefix + i;
//            if (!floorRepository.existsByFloorName(floorName)) {
//                floors.add(new Floor(floorName));
//            } else {
//                log.warn("Duplicate floor '{}' skipped", floorName);
//            }
//        }
//
//        if (floors.isEmpty()) {
//            throw new IllegalArgumentException("All floors already exist.");
//        }
//
//        List<Floor> saved = floorRepository.saveAll(floors);
//        log.info("Saved {} new floor(s)", saved.size());
//
//        return new ApiResponse<>(true, "Floors generated successfully",
//                saved.stream().map(this::mapToDTO).collect(Collectors.toList()));
//    }

    /** READ - Get All Floors (Sorted) */
    public ApiResponse<List<FloorResponseDTO>> getAllFloorsSorted() {
        List<FloorResponseDTO> allFloors = floorRepository.findAll().stream()
                .sorted((f1, f2) -> f1.getFloorName().compareToIgnoreCase(f2.getFloorName()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        log.info("Fetched {} floor(s)", allFloors.size());
        return new ApiResponse<>(true, "Floors fetched successfully", allFloors);
    }

    /** READ - Get Floor By ID */
    public ApiResponse<FloorResponseDTO> getFloorById(Long id) {
        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with ID: " + id));
        log.info("Fetched floor: {}", floor.getFloorName());
        return new ApiResponse<>(true, "Floor fetched successfully", mapToDTO(floor));
    }

    /** UPDATE - Update Floor Name */
    public ApiResponse<FloorResponseDTO> updateFloor(Long id, String newName) {
        String sanitized = sanitize(newName);
        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with ID: " + id));

        if (floorRepository.existsByFloorName(sanitized)) {
            throw new IllegalArgumentException("Floor name already exists.");
        }

        floor.setFloorName(sanitized);
        Floor updated = floorRepository.save(floor);

        log.info("Updated floor ID {} to '{}'", id, sanitized);
        return new ApiResponse<>(true, "Floor updated successfully", mapToDTO(updated));
    }

    /** DELETE - Delete Floor By ID */
    public ApiResponse<String> deleteFloor(Long id) {
        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with ID: " + id));

        floorRepository.delete(floor);
        log.info("Deleted floor ID {}", id);
        return new ApiResponse<>(true, "Floor deleted successfully", null);
    }

    /** Map Entity to DTO */
    private FloorResponseDTO mapToDTO(Floor floor) {
        return new FloorResponseDTO(floor.getId(), floor.getFloorName());
    }

    /** Sanitize Input */
    private String sanitize(String input) {
        return StringUtils.trimWhitespace(input.replaceAll("[^a-zA-Z0-9+]", ""));
    }
}