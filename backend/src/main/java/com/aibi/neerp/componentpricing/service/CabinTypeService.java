package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.dto.CabinTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.CabinTypeResponseDTO;
import com.aibi.neerp.componentpricing.entity.CabinType;
import com.aibi.neerp.componentpricing.repository.CabinTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CabinTypeService {

    @Autowired
    CabinTypeRepository cabinTypeRepository;

    public CabinTypeResponseDTO create(CabinTypeRequestDTO dto) {
        CabinType cabinType = new CabinType();
        cabinType.setCabinType(dto.getCabinType());
        CabinType saved = cabinTypeRepository.save(cabinType);
        return new CabinTypeResponseDTO(saved.getId(), saved.getCabinType());
    }

    public List<CabinTypeResponseDTO> findAll() {
        return cabinTypeRepository.findAll(Sort.by("id").ascending()).stream()
                .map(c -> new CabinTypeResponseDTO(c.getId(), c.getCabinType()))
                .collect(Collectors.toList());
    }

    public CabinTypeResponseDTO findById(int id) {
        CabinType c = cabinTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cabin Type data not found with id: " + id));
        return new CabinTypeResponseDTO(c.getId(), c.getCabinType());
    }

    public CabinTypeResponseDTO update(int id, CabinTypeRequestDTO dto) {
        CabinType existing = cabinTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cabin Type data not found for updation"));

        existing.setCabinType(dto.getCabinType());
        CabinType updated = cabinTypeRepository.save(existing);
        return new CabinTypeResponseDTO(updated.getId(), updated.getCabinType());
    }

    public void deleteById(int id) {
        CabinType existing = cabinTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cabin Type data not found for deletion."));
        cabinTypeRepository.delete(existing);
    }
}
