package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.LopSubTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.LopSubTypeResponseDTO;
import com.aibi.neerp.componentpricing.dto.LopTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.LopTypeResponseDTO;
import com.aibi.neerp.componentpricing.entity.Floor;
import com.aibi.neerp.componentpricing.entity.LopSubType;
import com.aibi.neerp.componentpricing.entity.LopType;
import com.aibi.neerp.componentpricing.entity.OperatorElevator;
import com.aibi.neerp.componentpricing.repository.FloorRepository;
import com.aibi.neerp.componentpricing.repository.LopSubTypeRepository;
import com.aibi.neerp.componentpricing.repository.LopTypeRepository;
import com.aibi.neerp.componentpricing.repository.OperatorElevatorRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LopService {

    private final LopTypeRepository lopTypeRepo;
    private final LopSubTypeRepository lopSubTypeRepo;
    private final OperatorElevatorRepository operatorRepo;
    private final FloorRepository floorRepo;

    // ---------------- LopType ----------------
    public LopTypeResponseDTO createLopType(LopTypeRequestDTO dto) {
        log.info("Creating LopType: {}", dto.getLopType());
        sanitize(dto);

        OperatorElevator operator = operatorRepo.findById(dto.getOperatorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found"));

        LopType entity = new LopType();
        entity.setLopName(dto.getLopType().trim());
        entity.setOperatorType(operator);

        LopType saved = lopTypeRepo.save(entity);
        log.info("LopType created with ID: {}", saved.getId());

        return toLopTypeDTO(saved);
    }

    @Transactional
    public LopTypeResponseDTO updateLopType(Integer id, LopTypeRequestDTO dto) {
        log.info("Updating LopType ID: {}", id);
        sanitize(dto);

        LopType existing = lopTypeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LopType not found"));

        OperatorElevator newOperator = operatorRepo.findById(dto.getOperatorTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found"));

        existing.setLopName(dto.getLopType().trim());
        existing.setOperatorType(newOperator);

        LopType savedType = lopTypeRepo.save(existing);

        // Update LopSubType operator reference if needed
        List<LopSubType> relatedSubTypes = lopSubTypeRepo.findByLopType_Id(id);
        for (LopSubType sub : relatedSubTypes) {
            sub.setLopType(savedType);
        }
        lopSubTypeRepo.saveAll(relatedSubTypes);

        log.info("Updated LopType and {} related LopSubTypes", relatedSubTypes.size());

        return toLopTypeDTO(savedType);
    }

    public void deleteLopType(Integer id) {
        log.warn("Deleting LopType ID: {}", id);
        LopType entity = lopTypeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LopType not found"));
        lopTypeRepo.delete(entity);
        log.info("LopType deleted: {}", id);
    }

    public List<LopTypeResponseDTO> getAllLopTypes() {
        log.info("Fetching all LopTypes");
        return lopTypeRepo.findAll(Sort.by("id").ascending())
                .stream().map(this::toLopTypeDTO).collect(Collectors.toList());
    }

    // ---------------- LopSubType ----------------
    public LopSubTypeResponseDTO createLopSubType(LopSubTypeRequestDTO dto) {
        log.info("Creating LopSubType: {}", dto.getName());
        sanitize(dto);

        Floor floor = floorRepo.findById(Long.valueOf(dto.getFloorId()))
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));
        LopType lopType = lopTypeRepo.findById(dto.getLopTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("LopType not found"));

        LopSubType entity = new LopSubType();
        entity.setLopName(dto.getName().trim());
        entity.setPrice(dto.getPrice());
        entity.setFloor(floor);
        entity.setLopType(lopType);

        LopSubType saved = lopSubTypeRepo.save(entity);
        log.info("LopSubType created with ID: {}", saved.getId());

        return toLopSubTypeDTO(saved);
    }

    public LopSubTypeResponseDTO updateLopSubType(Integer id, LopSubTypeRequestDTO dto) {
        log.info("Updating LopSubType ID: {}", id);
        sanitize(dto);

        LopSubType existing = lopSubTypeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LopSubType not found"));

        Floor floor = floorRepo.findById(Long.valueOf(dto.getFloorId()))
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));
        LopType lopType = lopTypeRepo.findById(dto.getLopTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("LopType not found"));

        existing.setLopName(dto.getName().trim());
        existing.setPrice(dto.getPrice());
        existing.setFloor(floor);
        existing.setLopType(lopType);

        LopSubType saved = lopSubTypeRepo.save(existing);
        log.info("LopSubType updated ID: {}", id);

        return toLopSubTypeDTO(saved);
    }

    public void deleteLopSubType(Integer id) {
        log.warn("Deleting LopSubType ID: {}", id);
        LopSubType entity = lopSubTypeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LopSubType not found"));
        lopSubTypeRepo.delete(entity);
        log.info("LopSubType deleted: {}", id);
    }

    public List<LopSubTypeResponseDTO> getAllLopSubTypes() {
        log.info("Fetching all LopSubTypes");
        return lopSubTypeRepo.findAll(Sort.by("id").ascending())
                .stream().map(this::toLopSubTypeDTO).collect(Collectors.toList());
    }

    // ---------------- Helper Methods ----------------
    private void sanitize(LopTypeRequestDTO dto) {
        if (dto.getLopType() != null) dto.setLopType(dto.getLopType().trim());
    }

    private void sanitize(LopSubTypeRequestDTO dto) {
        if (dto.getName() != null) dto.setName(dto.getName().trim());
    }

    private LopTypeResponseDTO toLopTypeDTO(LopType entity) {
        LopTypeResponseDTO dto = new LopTypeResponseDTO();
        dto.setLopTypeId(entity.getId());
        dto.setLopType(entity.getLopName());
        dto.setOperatorTypeId(entity.getOperatorType().getId());
        dto.setOperatorTypeName(entity.getOperatorType().getName());
        return dto;
    }

    private LopSubTypeResponseDTO toLopSubTypeDTO(LopSubType entity) {
        LopSubTypeResponseDTO dto = new LopSubTypeResponseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getLopName());
        dto.setPrice(Double.valueOf(entity.getPrice()));
        dto.setFloorId(entity.getFloor().getId());
        dto.setFloorName(entity.getFloor().getFloorName());
        dto.setLopTypeId(entity.getLopType().getId());
        dto.setLopTypeName(entity.getLopType().getLopName());

        if (entity.getLopType().getOperatorType() != null) {
            dto.setOperatorTypeId(entity.getLopType().getOperatorType().getId());
            dto.setOperatorTypeName(entity.getLopType().getOperatorType().getName());
        }

        return dto;
    }

    public List<LopSubTypeResponseDTO> searchLopSubTypes(Integer operatorTypeId, Integer floorId) {
        log.info("Searching LopSubTypes... operatorTypeId={}, floorId={}", operatorTypeId, floorId);
        System.out.println("Searching LopSubTypes... operatorTypeId=" + operatorTypeId + ", floorId=" + floorId);

        return lopSubTypeRepo.findAll().stream()
                .filter(sub -> operatorTypeId == null ||
                        (sub.getLopType().getOperatorType() != null &&
                                sub.getLopType().getOperatorType().getId().equals(operatorTypeId)))
                .filter(sub -> floorId == null ||
                        (sub.getFloor() != null && Objects.equals(sub.getFloor().getId(), floorId)))
                // 👇 log & print entity
                .peek(sub -> {
                    log.info("Matched LopSubType: id={}, name={}, floorId={}, operatorTypeId={}",
                            sub.getId(),
                            sub.getLopName(),
                            sub.getFloor() != null ? sub.getFloor().getId() : null,
                            sub.getLopType().getOperatorType() != null ? sub.getLopType().getOperatorType().getId() : null
                    );

                    System.out.println("Matched LopSubType => id=" + sub.getId() +
                            ", name=" + sub.getLopName() +
                            ", floorId=" + (sub.getFloor() != null ? sub.getFloor().getId() : null) +
                            ", operatorTypeId=" + (sub.getLopType().getOperatorType() != null
                            ? sub.getLopType().getOperatorType().getId()
                            : null));
                })
                .map(this::toLopSubTypeDTO)
                // 👇 log & print DTO
                .peek(dto -> {
                    log.info("Mapped LopSubTypeDTO: {}", dto);
                    System.out.println("Mapped LopSubTypeDTO => " + dto);
                })
                .collect(Collectors.toList());
    }


}
