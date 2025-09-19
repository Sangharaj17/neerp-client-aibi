package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.WeightRequestDTO;
import com.aibi.neerp.componentpricing.dto.WeightResponseDTO;
import com.aibi.neerp.componentpricing.entity.CapacityType;
import com.aibi.neerp.componentpricing.entity.Unit;
import com.aibi.neerp.componentpricing.entity.Weight;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.CapacityTypeRepository;
import com.aibi.neerp.componentpricing.repository.UnitRepository;
import com.aibi.neerp.componentpricing.repository.WeightRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WeightService {

    private final WeightRepository weightRepo;
    private final UnitRepository unitRepo;
    private final CapacityTypeRepository capacityTypeRepo;

    public WeightService(WeightRepository weightRepo, UnitRepository unitRepo, CapacityTypeRepository capacityTypeRepo) {
        this.weightRepo = weightRepo;
        this.unitRepo = unitRepo;
        this.capacityTypeRepo = capacityTypeRepo;
    }

    public List<WeightResponseDTO> getAllWeights() {
        return weightRepo.findAll(Sort.by("id").ascending()).stream().map(w ->
                new WeightResponseDTO(w.getId(), w.getUnit().getId(), w.getWeightValue(), w.getCapacityType().getId())
        ).collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse<WeightResponseDTO> createWeight(WeightRequestDTO dto) {
        boolean exists = weightRepo.existsByUnitIdAndWeightValueAndCapacityTypeId(
                dto.getUnitId(), dto.getWeightValue(), dto.getCapacityTypeId()
        );

        if (exists) {
            throw new RuntimeException("Weight already exists for this unit and capacity type");
        }
        Unit unit = unitRepo.findById(dto.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found with id: " + dto.getUnitId()));

        CapacityType capacityType = capacityTypeRepo.findById(dto.getCapacityTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("CapacityType not found with id: " + dto.getCapacityTypeId()));

        Weight weight = new Weight();
        weight.setUnit(unit);
        weight.setWeightValue(dto.getWeightValue());
        weight.setCapacityType(capacityType);

        weightRepo.save(weight);

        return new ApiResponse<>(true, "Weight added successfully", new WeightResponseDTO(
                weight.getId(), unit.getId(), weight.getWeightValue(), capacityType.getId()));
    }

    @Transactional
    public ApiResponse<WeightResponseDTO> updateWeight(Integer id, WeightRequestDTO dto) {
        Weight weight = weightRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Weight not found with id: " + id));

        Unit unit = unitRepo.findById(dto.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found with id: " + dto.getUnitId()));

        CapacityType capacityType = capacityTypeRepo.findById(dto.getCapacityTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("CapacityType not found with id: " + dto.getCapacityTypeId()));

        weight.setUnit(unit);
        weight.setWeightValue(dto.getWeightValue());
        weight.setCapacityType(capacityType);

        weightRepo.save(weight);

        return new ApiResponse<>(true, "Weight updated successfully", new WeightResponseDTO(
                weight.getId(), unit.getId(), weight.getWeightValue(), capacityType.getId()));
    }

    public ApiResponse<String> deleteWeight(Integer id) {
        Weight weight = weightRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Weight not found with id: " + id));

        weightRepo.delete(weight);
        return new ApiResponse<>(true, "Weight deleted successfully", null);
    }

    public ApiResponse<WeightResponseDTO> getWeightById(Integer id) {
        Weight weight = weightRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Weight not found with id: " + id));

        WeightResponseDTO dto = new WeightResponseDTO(
                weight.getId(),
                weight.getUnit().getId(),
                weight.getWeightValue(),
                weight.getCapacityType().getId()
        );

        return new ApiResponse<>(true, "Weight fetched", dto);
    }


}
