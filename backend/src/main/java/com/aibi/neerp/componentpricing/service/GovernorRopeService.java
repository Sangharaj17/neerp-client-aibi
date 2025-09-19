package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.GovernorRopeRequestDTO;
import com.aibi.neerp.componentpricing.dto.GovernorRopeResponseDTO;
import com.aibi.neerp.componentpricing.entity.Floor;
import com.aibi.neerp.componentpricing.entity.GovernorRope;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.repository.FloorRepository;
import com.aibi.neerp.componentpricing.repository.GovernorRopeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GovernorRopeService {

    private final GovernorRopeRepository governorRopeRepository;
    private final FloorRepository floorRepository;

    @Transactional
    public GovernorRopeResponseDTO createGovernorRope(GovernorRopeRequestDTO requestDTO) {
        log.info("Creating new GovernorRope: {}", requestDTO);

        Floor floor = floorRepository.findById(Long.valueOf(requestDTO.getFloorId()))
                .orElseThrow(() -> {
                    log.error("Floor not found with ID {}", requestDTO.getFloorId());
                    return new ResourceNotFoundException("Floor not found");
                });

        GovernorRope governorRope = new GovernorRope();
        governorRope.setGovernorName(sanitize(requestDTO.getGovernorName()));
        governorRope.setPrize(requestDTO.getPrice());
        governorRope.setQuantity(sanitize(requestDTO.getQuantity()));
        governorRope.setFloor(floor);

        GovernorRope saved = governorRopeRepository.save(governorRope);
        log.info("GovernorRope created successfully with ID {}", saved.getId());
        return mapToResponseDTO(saved);
    }

    @Transactional
    public GovernorRopeResponseDTO updateGovernorRope(int id, GovernorRopeRequestDTO requestDTO) {
        log.info("Updating GovernorRope with ID {}", id);

        GovernorRope governorRope = governorRopeRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("GovernorRope not found with ID {}", id);
                    return new ResourceNotFoundException("GovernorRope not found");
                });

        Floor floor = floorRepository.findById(Long.valueOf(requestDTO.getFloorId()))
                .orElseThrow(() -> {
                    log.error("Floor not found with ID {}", requestDTO.getFloorId());
                    return new ResourceNotFoundException("Floor not found");
                });

        governorRope.setGovernorName(sanitize(requestDTO.getGovernorName()));
        governorRope.setPrize(requestDTO.getPrice());
        governorRope.setQuantity(sanitize(requestDTO.getQuantity()));
        governorRope.setFloor(floor);

        GovernorRope updated = governorRopeRepository.save(governorRope);
        log.info("GovernorRope updated successfully with ID {}", updated.getId());
        return mapToResponseDTO(updated);
    }

    public List<GovernorRopeResponseDTO> getAllGovernorRopes(String sortBy, String sortDir) {
        log.info("Fetching all GovernorRopes sorted by {} {}", sortBy, sortDir);
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return governorRopeRepository.findAll(sort)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public GovernorRopeResponseDTO getGovernorRopeById(int id) {
        log.info("Fetching GovernorRope with ID {}", id);
        GovernorRope rope = governorRopeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GovernorRope not found"));
        return mapToResponseDTO(rope);
    }

    public void deleteGovernorRope(int id) {
        log.warn("Deleting GovernorRope with ID {}", id);
        GovernorRope rope = governorRopeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GovernorRope not found"));
        governorRopeRepository.delete(rope);
    }

    private GovernorRopeResponseDTO mapToResponseDTO(GovernorRope rope) {
        return GovernorRopeResponseDTO.builder()
                .id(rope.getId())
                .governorName(rope.getGovernorName())
                .price(rope.getPrize())
                .quantity(rope.getQuantity())
                .floorName(rope.getFloor().getFloorName())
                .build();
    }

    private String sanitize(String input) {
        return StringEscapeUtils.escapeHtml4(input.trim());
    }
}
