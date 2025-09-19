package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.UnitRequestDTO;
import com.aibi.neerp.componentpricing.dto.UnitResponseDTO;
import com.aibi.neerp.componentpricing.entity.Unit;
import com.aibi.neerp.componentpricing.repository.UnitRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class UnitService {

    @Autowired
    private UnitRepository repo;

    public UnitResponseDTO create(UnitRequestDTO dto) {
        log.info("📥 Received request to create Unit: {}", dto.getUnitName());
        Unit u = new Unit();
        u.setUnitName(dto.getUnitName());
        u.setDescription(dto.getDescription());
        Unit saved = repo.save(u);
        return new UnitResponseDTO(saved.getId(), saved.getUnitName(), saved.getDescription());
    }

    public List<UnitResponseDTO> findAll() {
        return repo.findAll(Sort.by("id").ascending()).stream()
                .map(u -> new UnitResponseDTO(u.getId(), u.getUnitName(), u.getDescription()))
                .toList();
    }

    public UnitResponseDTO update(Integer id, UnitRequestDTO dto) {
        log.info("📥 Received request to update Unit: {}", dto.getUnitName());
        Unit u = repo.findById(id).orElseThrow(() -> new RuntimeException("Unit not found"));
        log.info("📥 Unit not found: {}", dto.getUnitName());
        u.setUnitName(dto.getUnitName());
        u.setDescription(dto.getDescription());
        Unit updated = repo.save(u);
        return new UnitResponseDTO(updated.getId(), updated.getUnitName(), updated.getDescription());
    }

    public void delete(Integer id) {
        Unit u = repo.findById(id).orElseThrow(() -> new RuntimeException("Unit not found"));
        repo.delete(u);
    }
}
