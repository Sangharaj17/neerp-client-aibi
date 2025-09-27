package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.entity.Speed;
import com.aibi.neerp.componentpricing.repository.SpeedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpeedService {
    private final SpeedRepository repo;

    public List<Speed> getAll() {
        return repo.findAll();
    }

    public Speed create(Speed speed) {
        if (repo.existsByValue(speed.getValue())) {
            throw new RuntimeException("Speed already exists: " + speed.getValue());
        }
        return repo.save(speed);
    }

    public Speed update(Integer id, Speed speed) {
        Speed existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Speed not found with id " + id));

        // prevent duplicate on update
        if (!existing.getValue().equals(speed.getValue()) && repo.existsByValue(speed.getValue())) {
            throw new RuntimeException("Speed already exists: " + speed.getValue());
        }

        existing.setValue(speed.getValue());
        return repo.save(existing);
    }

    public void delete(Integer id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Speed not found with id " + id);
        }
        repo.deleteById(id);
    }
}

