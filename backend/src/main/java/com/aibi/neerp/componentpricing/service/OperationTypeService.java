package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.entity.OperationType;
import com.aibi.neerp.componentpricing.repository.OperationTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OperationTypeService {

    private final OperationTypeRepository OperationTypeRepository;

    public OperationType createFeature(OperationType feature) {
        // if isActive not explicitly set, it will stay true
        return OperationTypeRepository.save(feature);
    }

    public OperationType updateFeature(Integer id, OperationType feature) {
        OperationType existing = OperationTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feature not found with id " + id));

        existing.setName(feature.getName());
        existing.setActive(feature.isActive());
        return OperationTypeRepository.save(existing);
    }

    public List<OperationType> getAllOperationType() {
        return OperationTypeRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public OperationType getFeatureById(Integer id) {
        return OperationTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feature not found with id " + id));
    }

    public void deleteFeature(Integer id) {
        OperationTypeRepository.deleteById(id);
    }
}
