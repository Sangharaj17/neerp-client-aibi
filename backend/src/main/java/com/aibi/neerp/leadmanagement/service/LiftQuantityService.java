package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.dto.LiftQuantityDto;
import com.aibi.neerp.leadmanagement.entity.LiftQuantity;
import com.aibi.neerp.leadmanagement.repository.LiftQuantityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LiftQuantityService {

    @Autowired
    private LiftQuantityRepository liftQuantityRepository;

    public List<LiftQuantityDto> getAll() {
        return liftQuantityRepository.findAll().stream()
                .map(q -> new LiftQuantityDto(q.getId(), q.getQuantity()))
                .collect(Collectors.toList());
    }

    public LiftQuantityDto getById(Integer id) {
        LiftQuantity liftQuantity = liftQuantityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LiftQuantity not found with id: " + id));
        return new LiftQuantityDto(liftQuantity.getId(), liftQuantity.getQuantity());
    }

    public LiftQuantityDto create(LiftQuantityDto dto) {
        LiftQuantity liftQuantity = new LiftQuantity();
        liftQuantity.setQuantity(dto.getQuantity());
        liftQuantity = liftQuantityRepository.save(liftQuantity);
        return new LiftQuantityDto(liftQuantity.getId(), liftQuantity.getQuantity());
    }

    public LiftQuantityDto update(Integer id, LiftQuantityDto dto) {
        LiftQuantity existing = liftQuantityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LiftQuantity not found with id: " + id));
        existing.setQuantity(dto.getQuantity());
        existing = liftQuantityRepository.save(existing);
        return new LiftQuantityDto(existing.getId(), existing.getQuantity());
    }

    public void delete(Integer id) {
        if (!liftQuantityRepository.existsById(id)) {
            throw new ResourceNotFoundException("LiftQuantity not found with id: " + id);
        }
        try {
            liftQuantityRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot delete lift quantity because it's used in other records.");
        }
    }
}
