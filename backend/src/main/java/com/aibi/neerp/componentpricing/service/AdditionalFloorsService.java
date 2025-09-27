package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.entity.AdditionalFloors;
import com.aibi.neerp.componentpricing.repository.AdditionalFloorsRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdditionalFloorsService {

    private final AdditionalFloorsRepository repo;

    public List<AdditionalFloors> getAll() {
        return repo.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public AdditionalFloors create(AdditionalFloors floor) {
        if (repo.existsByCode(floor.getCode())) {
            throw new RuntimeException("Code already exists: " + floor.getCode());
        }
        return repo.save(floor);
    }

    public AdditionalFloors update(Integer id, AdditionalFloors updated) {
        AdditionalFloors existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Floor not found with id: " + id));

        existing.setCode(updated.getCode());
        existing.setLabel(updated.getLabel());
        return repo.save(existing);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
