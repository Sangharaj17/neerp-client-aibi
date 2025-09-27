package com.aibi.neerp.componentpricing.service;


import com.aibi.neerp.componentpricing.dto.AirSystemRequestDTO;
import com.aibi.neerp.componentpricing.dto.AirSystemResponseDTO;
import com.aibi.neerp.componentpricing.dto.AirTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.AirTypeResponseDTO;
import com.aibi.neerp.componentpricing.entity.AirSystem;
import com.aibi.neerp.componentpricing.entity.AirType;
import com.aibi.neerp.componentpricing.repository.*;
import com.aibi.neerp.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AirService {

    private final AirTypeRepository airTypeRepo;
    private final AirSystemRepository airSystemRepo;
    private final CapacityTypeRepository capacityTypeRepo;
    private final PersonCapacityRepository personCapacityRepo;
    private final WeightRepository weightRepo;

    // ----------------- AirType CRUD -----------------
    public AirTypeResponseDTO createAirType(AirTypeRequestDTO dto) {
        sanitize(dto);
        log.info("Creating AirType: {}", dto.getName());

        AirType entity = new AirType();
        entity.setName(dto.getName());
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : true);

        AirType saved = airTypeRepo.save(entity);
        log.info("AirType created with ID: {}", saved.getId());

        return toAirTypeDTO(saved);
    }

    @Transactional
    public AirTypeResponseDTO updateAirType(Integer id, AirTypeRequestDTO dto) {
        sanitize(dto);
        log.info("Updating AirType ID: {}", id);

        AirType existing = airTypeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AirType not found"));

        existing.setName(dto.getName());
        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }

        AirType updated = airTypeRepo.save(existing);

        // Reflect in AirSystem
        List<AirSystem> relatedSystems = airSystemRepo.findByAirType_Id(id);
        for (AirSystem sys : relatedSystems) {
            sys.setAirType(updated);
        }
        airSystemRepo.saveAll(relatedSystems);
        log.info("Updated AirType and {} related AirSystems", relatedSystems.size());

        return toAirTypeDTO(updated);
    }

    public void deleteAirType(Integer id) {
        log.warn("Deleting AirType ID: {}", id);
        AirType entity = airTypeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AirType not found"));
        airTypeRepo.delete(entity);
    }

    public List<AirTypeResponseDTO> getAllAirTypes() {
        log.info("Fetching all AirTypes");
        return airTypeRepo.findAll(Sort.by("id").ascending())
                .stream().map(this::toAirTypeDTO).collect(Collectors.toList());
    }

    // ----------------- AirSystem CRUD -----------------
    public AirSystemResponseDTO createAirSystem(AirSystemRequestDTO dto) {
        sanitize(dto);
        log.info("Creating AirSystem: {}", dto.getAirTypeId());

        AirSystem entity = mapToAirSystemEntity(dto);
        AirSystem saved = airSystemRepo.save(entity);

        log.info("AirSystem created with ID: {}", saved.getId());
        return toAirSystemDTO(saved);
    }

    public AirSystemResponseDTO updateAirSystem(Integer id, AirSystemRequestDTO dto) {
        sanitize(dto);
        log.info("Updating AirSystem ID: {}", id);

        AirSystem existing = airSystemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AirSystem not found"));

        AirSystem updatedEntity = mapToAirSystemEntity(dto);
        updatedEntity.setId(existing.getId());

        AirSystem saved = airSystemRepo.save(updatedEntity);
        return toAirSystemDTO(saved);
    }

    public void deleteAirSystem(Integer id) {
        log.warn("Deleting AirSystem ID: {}", id);
        AirSystem entity = airSystemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AirSystem not found"));
        airSystemRepo.delete(entity);
    }

    public List<AirSystemResponseDTO> getAllAirSystems() {
        log.info("Fetching all AirSystems");
        return airSystemRepo.findAll(Sort.by("id").ascending())
                .stream().map(this::toAirSystemDTO).collect(Collectors.toList());
    }

    public AirSystemResponseDTO getAirSystemPrice(AirSystemRequestDTO dto) {
        log.info("Looking up price for AirSystem with AirTypeId={}, CapacityTypeId={}",
                dto.getAirTypeId(), dto.getCapacityTypeId());

        AirSystem airSystem = airSystemRepo.findByAirType_IdAndCapacityType_IdAndPersonCapacity_IdOrWeight_Id(
                dto.getAirTypeId(),
                dto.getCapacityTypeId(),
                dto.getPersonId(),
                dto.getWeightId()
        ).orElseThrow(() -> new ResourceNotFoundException("No matching AirSystem price found"));

        System.out.println("Looking up price for AirSystem with AirTypeId={}, CapacityTypeId={}"+
                dto.getAirTypeId()+"---"+ dto.getCapacityTypeId()+"--person--"+dto.getPersonId()+"--weight---"+
                dto.getWeightId());
        System.out.println(toAirSystemDTO(airSystem));

        return toAirSystemDTO(airSystem);
    }


    // ----------------- Helper Methods -----------------
    private void sanitize(AirTypeRequestDTO dto) {
        if (dto.getName() != null) dto.setName(dto.getName().trim());
    }

    private void sanitize(AirSystemRequestDTO dto) {
        //if (dto.getAirSystemName() != null) dto.setAirSystemName(dto.getAirSystemName().trim());
        if (dto.getQuantity() != null) dto.setQuantity(dto.getQuantity().trim());
    }

    private AirTypeResponseDTO toAirTypeDTO(AirType entity) {
        AirTypeResponseDTO dto = new AirTypeResponseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setStatus(entity.isStatus());
        return dto;
    }

    private AirSystemResponseDTO toAirSystemDTO(AirSystem entity) {
        AirSystemResponseDTO dto = new AirSystemResponseDTO();
        dto.setId(entity.getId());
        //dto.setAirSystemName(entity.getAirType().getName());
        dto.setPrice(entity.getPrice());
        dto.setQuantity(entity.getQuantity());

        if (entity.getCapacityType() != null) {
            dto.setCapacityTypeId(entity.getCapacityType().getId());
            dto.setCapacityTypeName(entity.getCapacityType().getType());
        }
        if (entity.getPersonCapacity() != null) {
            dto.setPersonCapacityId(entity.getPersonCapacity().getId());
            dto.setPersonCapacityName(entity.getPersonCapacity().getDisplayName());
        }
        if (entity.getWeight() != null) {
            dto.setWeightId(entity.getWeight().getId());
            dto.setWeightName(entity.getWeight().getWeightValue()+" "+entity.getWeight().getUnit().getUnitName());
        }
        if (entity.getAirType() != null) {
            dto.setAirTypeId(entity.getAirType().getId());
            dto.setAirTypeName(entity.getAirType().getName());
        }
        return dto;
    }

    private AirSystem mapToAirSystemEntity(AirSystemRequestDTO dto) {
        AirSystem entity = new AirSystem();
        //entity.setAirSystemName(dto.getAirSystemName());
        entity.setPrice(dto.getPrice());
        entity.setQuantity(dto.getQuantity());

        entity.setCapacityType(capacityTypeRepo.findById(dto.getCapacityTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Capacity Type not found")));

        if (dto.getPersonId() != null) {
            entity.setPersonCapacity(personCapacityRepo.findById(dto.getPersonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Person Capacity not found")));
        }
        if (dto.getWeightId() != null) {
            entity.setWeight(weightRepo.findById(dto.getWeightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Weight not found")));
        }

        entity.setAirType(airTypeRepo.findById(dto.getAirTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("AirType not found")));

        return entity;
    }
}
