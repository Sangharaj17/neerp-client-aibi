package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.leadmanagement.entity.BuildingType;
import com.aibi.neerp.leadmanagement.repository.BuildingTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BuildingTypeService {

    @Autowired
    private BuildingTypeRepository buildingTypeRepository;

    // Get all
    public List<BuildingType> getAllBuildingTypes() {
        return buildingTypeRepository.findAll();
    }

    // Get by ID
    public BuildingType getBuildingTypeById(Integer id) {
        return buildingTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BuildingType not found with id: " + id));
    }

    // Create
    public BuildingType createBuildingType(BuildingType buildingType) {
        return buildingTypeRepository.save(buildingType);
    }

    // Update
    public BuildingType updateBuildingType(Integer id, BuildingType buildingType) {
        BuildingType existing = buildingTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BuildingType not found with id: " + id));
        existing.setBuildingType(buildingType.getBuildingType());
        return buildingTypeRepository.save(existing);
    }

    // Delete
    public void deleteBuildingType(Integer id) {
        BuildingType existing = buildingTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BuildingType not found with id: " + id));
        buildingTypeRepository.delete(existing);
    }
}
