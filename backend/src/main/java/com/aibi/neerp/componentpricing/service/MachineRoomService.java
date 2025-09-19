package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.MachineRoomRequestDTO;
import com.aibi.neerp.componentpricing.dto.MachineRoomResponseDTO;
import com.aibi.neerp.componentpricing.entity.MachineRoom;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.MachineRoomRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MachineRoomService {

    private final MachineRoomRepository repository;

    public ApiResponse<MachineRoomResponseDTO> create(MachineRoomRequestDTO dto) {
        log.info("Creating MachineRoom: {}", dto.getMachineRoomName());
        dto.sanitize();

        if (repository.existsByMachineRoomNameIgnoreCase(dto.getMachineRoomName())) {
            log.warn("Duplicate MachineRoom creation attempt: {}", dto.getMachineRoomName());
            throw new IllegalArgumentException("Machine Room with this name already exists");
        }

        MachineRoom entity = new MachineRoom();
        entity.setMachineRoomName(dto.getMachineRoomName());

        MachineRoom saved = repository.save(entity);
        log.info("MachineRoom created successfully with ID: {}", saved.getId());

        return new ApiResponse<>(true, "Machine Room created successfully",
                new MachineRoomResponseDTO(saved.getId(), saved.getMachineRoomName()));
    }

    public ApiResponse<MachineRoomResponseDTO> update(int id, MachineRoomRequestDTO dto) {
        log.info("Updating MachineRoom with ID: {}", id);
        dto.sanitize();

        MachineRoom existing = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("MachineRoom not found for update: ID {}", id);
                    return new ResourceNotFoundException("Machine Room not found with ID: " + id);
                });

        if (repository.existsByMachineRoomNameIgnoreCase(dto.getMachineRoomName())
                && !existing.getMachineRoomName().equalsIgnoreCase(dto.getMachineRoomName())) {
            log.warn("Duplicate MachineRoom update attempt: {}", dto.getMachineRoomName());
            throw new IllegalArgumentException("Machine Room with this name already exists");
        }

        existing.setMachineRoomName(dto.getMachineRoomName());
        MachineRoom updated = repository.save(existing);

        log.info("MachineRoom updated successfully with ID: {}", updated.getId());

        return new ApiResponse<>(true, "Machine Room updated successfully",
                new MachineRoomResponseDTO(updated.getId(), updated.getMachineRoomName()));
    }

    public ApiResponse<List<MachineRoomResponseDTO>> getAll(String sortBy, String direction) {
        log.info("Fetching all MachineRooms sorted by {} {}", sortBy, direction);
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        List<MachineRoomResponseDTO> result = repository.findAll(sort)
                .stream()
                .map(m -> new MachineRoomResponseDTO(m.getId(), m.getMachineRoomName()))
                .collect(Collectors.toList());

        return new ApiResponse<>(true, "Machine Rooms fetched successfully", result);
    }

    public ApiResponse<String> delete(int id) {
        log.info("Deleting MachineRoom with ID: {}", id);

        MachineRoom existing = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("MachineRoom not found for delete: ID {}", id);
                    return new ResourceNotFoundException("Machine Room not found with ID: " + id);
                });

        try {
            repository.delete(existing);
            log.info("MachineRoom deleted successfully with ID: {}", id);
            return new ApiResponse<>(true, "Machine Room deleted successfully", null);
        } catch (DataIntegrityViolationException ex) {
            log.error("Cannot delete MachineRoom ID {} due to data integrity issues", id, ex);
            throw new DataIntegrityViolationException("Cannot delete: Machine Room is in use");
        }
    }
}
