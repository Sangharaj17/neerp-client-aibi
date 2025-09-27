package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.entity.Features;
import com.aibi.neerp.componentpricing.repository.FeaturesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeaturesService {

    private final FeaturesRepository featuresRepository;

    public Features createFeature(Features feature) {
        // if isActive not explicitly set, it will stay true
        return featuresRepository.save(feature);
    }

    public Features updateFeature(Integer id, Features feature) {
        Features existing = featuresRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feature not found with id " + id));

        existing.setName(feature.getName());
        existing.setActive(feature.isActive());
        return featuresRepository.save(existing);
    }

    public List<Features> getAllFeatures() {
        return featuresRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public Features getFeatureById(Integer id) {
        return featuresRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feature not found with id " + id));
    }

    public void deleteFeature(Integer id) {
        featuresRepository.deleteById(id);
    }
}
