package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.BracketRequestDTO;
import com.aibi.neerp.componentpricing.dto.BracketResponseDTO;
import com.aibi.neerp.componentpricing.entity.Bracket;
import com.aibi.neerp.componentpricing.entity.BracketType;
import com.aibi.neerp.componentpricing.entity.Floor;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.repository.BracketRepository;
import com.aibi.neerp.componentpricing.repository.BracketTypeRepository;
import com.aibi.neerp.componentpricing.repository.FloorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BracketService {

    private final BracketRepository bracketRepository;
    private final BracketTypeRepository bracketTypeRepository;
    private final FloorRepository floorRepository;

    @Transactional
    public BracketResponseDTO createBracket(BracketRequestDTO request) {
        request.sanitize();
        log.info("Creating Bracket with BracketTypeId={}, FloorId={}, Price={}",
                request.getBracketTypeId(), request.getFloorId(), request.getPrice());

        BracketType bracketType = bracketTypeRepository.findById(request.getBracketTypeId())
                .orElseThrow(() -> {
                    log.error("BracketType not found with ID {}", request.getBracketTypeId());
                    return new ResourceNotFoundException("BracketType not found");
                });

        Floor floor = floorRepository.findById(Long.valueOf(request.getFloorId()))
                .orElseThrow(() -> {
                    log.error("Floor not found with ID {}", request.getFloorId());
                    return new ResourceNotFoundException("Floor not found");
                });

        Bracket bracket = new Bracket();
        bracket.setBracketType(bracketType);
        bracket.setPrice(request.getPrice());
        bracket.setFloor(floor);

        Bracket saved = bracketRepository.save(bracket);
        log.info("Bracket created successfully with ID {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional
    public BracketResponseDTO updateBracket(int id, BracketRequestDTO request) {
        request.sanitize();
        log.info("Updating Bracket with ID {}", id);

        Bracket bracket = bracketRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Bracket not found with ID {}", id);
                    return new ResourceNotFoundException("Bracket not found");
                });

        BracketType bracketType = bracketTypeRepository.findById(request.getBracketTypeId())
                .orElseThrow(() -> {
                    log.error("BracketType not found with ID {}", request.getBracketTypeId());
                    return new ResourceNotFoundException("BracketType not found");
                });

        Floor floor = floorRepository.findById(Long.valueOf(request.getFloorId()))
                .orElseThrow(() -> {
                    log.error("Floor not found with ID {}", request.getFloorId());
                    return new ResourceNotFoundException("Floor not found");
                });

        bracket.setBracketType(bracketType); // Reflect new type in Bracket
        bracket.setPrice(request.getPrice());
        bracket.setFloor(floor);

        Bracket updated = bracketRepository.save(bracket);
        log.info("Bracket updated successfully with ID {}", updated.getId());

        return mapToResponse(updated);
    }

    public List<BracketResponseDTO> getAllBrackets(String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        log.info("Fetching all brackets sorted by {} {}", sortBy, direction);
        return bracketRepository.findAll(sort)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BracketResponseDTO getBracketById(int id) {
        Bracket bracket = bracketRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Bracket not found with ID {}", id);
                    return new ResourceNotFoundException("Bracket not found");
                });
        return mapToResponse(bracket);
    }

    @Transactional
    public void deleteBracket(int id) {
        log.warn("Deleting Bracket with ID {}", id);
        Bracket bracket = bracketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bracket not found"));
        bracketRepository.delete(bracket);
        log.info("Bracket deleted with ID {}", id);
    }

    private BracketResponseDTO mapToResponse(Bracket bracket) {
        return BracketResponseDTO.builder()
                .id(bracket.getId())
                .bracketTypeName(bracket.getBracketType().getName())
                .price(bracket.getPrice())
                .floorName(bracket.getFloor().getFloorName())
                .build();
    }
}
