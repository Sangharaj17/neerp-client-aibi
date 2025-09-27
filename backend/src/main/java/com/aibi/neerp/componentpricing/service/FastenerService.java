package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.FastenerRequestDTO;
import com.aibi.neerp.componentpricing.dto.FastenerResponseDTO;
import com.aibi.neerp.componentpricing.entity.Fastener;
import com.aibi.neerp.componentpricing.entity.Floor;
import com.aibi.neerp.exception.DuplicateResourceException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.repository.FastenerRepository;
import com.aibi.neerp.componentpricing.repository.FloorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FastenerService {

    private final FastenerRepository fastenerRepository;
    private final FloorRepository floorRepository;

    public FastenerResponseDTO createFastener(FastenerRequestDTO dto) {
        Floor floor = floorRepository.findById(Long.valueOf(dto.getFloorId()))
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with id " + dto.getFloorId()));

        if (fastenerRepository.existsByFastenerNameAndFloor(dto.getFastenerName(), floor)) {
            throw new DuplicateResourceException("Fastener '" + dto.getFastenerName() +
                    "' already exists for floor '" + floor.getFloorName() + "'");
        }

        Fastener fastener = Fastener.builder()
                .fastenerName(dto.getFastenerName())
                .floor(floor)
                .price(dto.getPrice())
                .build();

        return toResponseDTO(fastenerRepository.save(fastener));
    }

    public List<FastenerResponseDTO> getAllFasteners() {
        return fastenerRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public FastenerResponseDTO getFastenerById(Integer id) {
        Fastener fastener = fastenerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fastener not found with id " + id));
        return toResponseDTO(fastener);
    }

    public List<FastenerResponseDTO> getFastenersByFloor(Long floorId) {
        Floor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with id " + floorId));

        return fastenerRepository.findByFloor(floor)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public FastenerResponseDTO updateFastener(Integer id, FastenerRequestDTO dto) {
        Fastener fastener = fastenerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fastener not found with id " + id));

        Floor floor = floorRepository.findById(Long.valueOf(dto.getFloorId()))
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with id " + dto.getFloorId()));

        if (fastenerRepository.existsByFastenerNameAndFloor(dto.getFastenerName(), floor)
                && !(fastener.getFastenerName().equals(dto.getFastenerName())
                && fastener.getFloor().getId().equals(floor.getId()))) {
            throw new DuplicateResourceException("Fastener '" + dto.getFastenerName() +
                    "' already exists for floor '" + floor.getFloorName() + "'");
        }

        fastener.setFastenerName(dto.getFastenerName());
        fastener.setFloor(floor);
        fastener.setPrice(dto.getPrice());

        return toResponseDTO(fastenerRepository.save(fastener));
    }

    public void deleteFastener(Integer id) {
        if (!fastenerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Fastener not found with id " + id);
        }
        fastenerRepository.deleteById(id);
    }

    private FastenerResponseDTO toResponseDTO(Fastener fastener) {
        return FastenerResponseDTO.builder()
                .id(fastener.getId())
                .fastenerName(fastener.getFastenerName())
                .floorId(fastener.getFloor().getId())
                .floorName(fastener.getFloor().getFloorName())
                .price(fastener.getPrice())
                .build();
    }
}
