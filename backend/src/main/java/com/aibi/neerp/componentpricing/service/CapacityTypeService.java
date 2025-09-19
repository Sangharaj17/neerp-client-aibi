package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.CapacityTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.CapacityTypeResponseDTO;
import com.aibi.neerp.componentpricing.entity.CapacityType;
import com.aibi.neerp.componentpricing.repository.CapacityTypeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class CapacityTypeService {

    @Autowired
    private CapacityTypeRepository repository;

    public CapacityTypeResponseDTO create(CapacityTypeRequestDTO dto) {
        String incomingType = dto.getType().trim().toLowerCase();

        // Check for duplicate (case-insensitive)
        boolean exists = repository.findAll(Sort.by("id").ascending()).stream()
                .anyMatch(ct -> ct.getType().trim().equalsIgnoreCase(incomingType));
        if (exists) {
            throw new RuntimeException("Capacity type already exists");
        }

        log.info("Creating new CapacityType: {}", dto.getType());
        CapacityType type = new CapacityType();
        type.setType(dto.getType().trim());
        CapacityType saved = repository.save(type);
        return new CapacityTypeResponseDTO(
                saved.getId(),
                saved.getType(),
                saved.getFieldKey(),
                saved.getFormKey()
        );
    }

    public List<CapacityTypeResponseDTO> findAll() {
        return repository.findAll().stream()
                .map(t -> new CapacityTypeResponseDTO(
                        t.getId(),
                        t.getType(),
                        t.getFieldKey(),
                        t.getFormKey()
                ))
                .toList();
    }

    public CapacityTypeResponseDTO update(Integer id, CapacityTypeRequestDTO dto) {
        String newType = dto.getType().trim().toLowerCase();

        CapacityType existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("CapacityType not found"));

        boolean duplicate = repository.findAll().stream()
                .anyMatch(ct -> !ct.getId().equals(id) && ct.getType().trim().equalsIgnoreCase(newType));
        if (duplicate) {
            throw new RuntimeException("Another capacity type with the same name already exists");
        }

        existing.setType(dto.getType().trim());
        CapacityType updated = repository.save(existing);
        return new CapacityTypeResponseDTO(
                updated.getId(),
                updated.getType(),
                updated.getFieldKey(),
                updated.getFormKey()
        );
    }

    public void delete(Integer id) {
        CapacityType type = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("CapacityType not found"));
        repository.delete(type);
        log.info("Deleted CapacityType with id {}", id);
    }
}
