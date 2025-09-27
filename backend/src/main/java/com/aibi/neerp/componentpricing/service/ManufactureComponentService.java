package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.ComponentDTO;
import com.aibi.neerp.componentpricing.dto.ManufactureDTO;
import com.aibi.neerp.componentpricing.entity.Manufacture;
import com.aibi.neerp.componentpricing.entity.Component;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.ManufactureRepository;
import com.aibi.neerp.componentpricing.repository.ComponentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ManufactureComponentService {

    private final ManufactureRepository manufactureRepository;
    private final ComponentRepository componentRepository;

    // ------------------ Manufacture CRUD ------------------
    public ApiResponse<ManufactureDTO> createManufacture(ManufactureDTO dto) {
        Component c = componentRepository.findById(dto.getComponentId())
                .orElseThrow(() -> new ResourceNotFoundException("Component not found"));

        // Check for duplicate name under same component
        boolean exists = manufactureRepository.existsByNameAndComponent(dto.getName(), c);
        if (exists) throw new RuntimeException("Manufacture already exists for this component");

        Manufacture m = Manufacture.builder()
                .name(dto.getName())
                .component(c)
                .build();

        Manufacture saved = manufactureRepository.save(m);
        return new ApiResponse<>(true, "Manufacture created", mapToDTO(saved));
    }

    //    public ApiResponse<List<ManufactureDTO>> getAllManufactures() {
//        List<ManufactureDTO> list = manufactureRepository.findAll()
//                .stream().map(this::mapToDTO).toList();
//        return new ApiResponse<>(true, "List of manufactures", list);
//    }
    public ApiResponse<Map<Integer, List<ManufactureDTO>>> getAllManufacturesGrouped() {
        Map<Integer, List<ManufactureDTO>> groupedManufactures = manufactureRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.groupingBy(ManufactureDTO::getComponentId));

        return new ApiResponse<>(true, "Manufactures grouped by component", groupedManufactures);
    }

    public ApiResponse<ManufactureDTO> updateManufacture(Integer id, ManufactureDTO dto) {
        Manufacture m = manufactureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manufacture not found"));

        if (dto.getComponentId() != null) {
            Component c = componentRepository.findById(dto.getComponentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Component not found"));
            m.setComponent(c);
        }
        m.setName(dto.getName());
        Manufacture updated = manufactureRepository.save(m);
        return new ApiResponse<>(true, "Manufacture updated", mapToDTO(updated));
    }

    public ApiResponse<Void> deleteManufacture(Integer id) {
        Manufacture m = manufactureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manufacture not found"));
        manufactureRepository.delete(m);
        return new ApiResponse<>(true, "Manufacture deleted", null);
    }

    // ------------------ Component CRUD ------------------
    public ApiResponse<ComponentDTO> createComponent(ComponentDTO dto) {
        boolean exists = componentRepository.existsByName(dto.getName());
        if (exists) throw new RuntimeException("Component already exists");

        Component c = Component.builder().name(dto.getName()).build();
        Component saved = componentRepository.save(c);
        return new ApiResponse<>(true, "Component created", mapToDTO(saved));
    }

    public ApiResponse<List<ComponentDTO>> getAllComponents() {
        List<ComponentDTO> list = componentRepository.findAll()
                .stream().map(this::mapToDTO).toList();
        return new ApiResponse<>(true, "List of components", list);
    }

    public ApiResponse<ComponentDTO> updateComponent(Integer id, ComponentDTO dto) {
        Component c = componentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Component not found"));
        c.setName(dto.getName());
        Component updated = componentRepository.save(c);
        return new ApiResponse<>(true, "Component updated", mapToDTO(updated));
    }

    public ApiResponse<Void> deleteComponent(Integer id) {
        Component c = componentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Component not found"));
        manufactureRepository.findAll().stream()
                .filter(m -> m.getComponent() != null && m.getComponent().getId().equals(id))
                .forEach(m -> m.setComponent(null));
        componentRepository.delete(c);
        return new ApiResponse<>(true, "Component deleted", null);
    }

    // ------------------ Mapping ------------------
    private ManufactureDTO mapToDTO(Manufacture m) {
        return ManufactureDTO.builder()
                .id(m.getId())
                .name(m.getName())
                .componentId(m.getComponent() != null ? m.getComponent().getId() : null)
                .componentName(m.getComponent() != null ? m.getComponent().getName() : null)
                .build();
    }

    private ComponentDTO mapToDTO(Component c) {
        return ComponentDTO.builder()
                .id(c.getId())
                .name(c.getName())
                .build();
    }
}
