package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.dto.DesignationDto;
import com.aibi.neerp.leadmanagement.entity.Designation;
import com.aibi.neerp.leadmanagement.repository.DesignationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DesignationService {

    @Autowired
    private DesignationRepository designationRepository;

    public List<DesignationDto> getAll() {
        return designationRepository.findAll().stream()
                .map(d -> new DesignationDto(d.getDesignationId(), d.getDesignationName()))
                .collect(Collectors.toList());
    }

    public DesignationDto getById(Integer id) {
        Designation d = designationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Designation not found with id: " + id));
        return new DesignationDto(d.getDesignationId(), d.getDesignationName());
    }

    public DesignationDto create(DesignationDto dto) {
        Designation d = new Designation();
        d.setDesignationName(dto.getDesignationName());
        d = designationRepository.save(d);
        return new DesignationDto(d.getDesignationId(), d.getDesignationName());
    }

    public DesignationDto update(Integer id, DesignationDto dto) {
        Designation d = designationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Designation not found with id: " + id));
        d.setDesignationName(dto.getDesignationName());
        d = designationRepository.save(d);
        return new DesignationDto(d.getDesignationId(), d.getDesignationName());
    }

    public void delete(Integer id) {
        if (!designationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Designation not found with id: " + id);
        }
        try {
            designationRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot delete designation because it's used in other records.");
        }
    }
}
