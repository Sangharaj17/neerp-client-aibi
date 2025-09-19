package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.entity.BuildingType;
import com.aibi.neerp.leadmanagement.service.BuildingTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadmanagement/building-types")
@CrossOrigin
public class BuildingTypeController {

    @Autowired
    private BuildingTypeService buildingTypeService;

    // Get all
    @GetMapping
    public List<BuildingType> getAllBuildingTypes() {
        return buildingTypeService.getAllBuildingTypes();
    }

    // Get by ID
    @GetMapping("/{id}")
    public BuildingType getBuildingTypeById(@PathVariable Integer id) {
        return buildingTypeService.getBuildingTypeById(id);
    }

    // Create
    @PostMapping
    public BuildingType createBuildingType(@RequestBody BuildingType buildingType) {
        return buildingTypeService.createBuildingType(buildingType);
    }

    // Update
    @PutMapping("/{id}")
    public BuildingType updateBuildingType(@PathVariable Integer id, @RequestBody BuildingType buildingType) {
        return buildingTypeService.updateBuildingType(id, buildingType);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String deleteBuildingType(@PathVariable Integer id) {
        buildingTypeService.deleteBuildingType(id);
        return "BuildingType deleted successfully";
    }
}
