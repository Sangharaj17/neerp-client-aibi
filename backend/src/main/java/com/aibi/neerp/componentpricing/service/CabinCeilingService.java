package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.entity.CabinCeiling;
import com.aibi.neerp.componentpricing.dto.CabinCeilingRequestDTO;
import com.aibi.neerp.componentpricing.dto.CabinCeilingResponseDTO;
import com.aibi.neerp.componentpricing.repository.CabinCeilingRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CabinCeilingService {

    private final CabinCeilingRepository ceilingRepository;

    public List<CabinCeilingResponseDTO> getAllCeilings() {
        log.info("Fetching all cabin ceilings sorted by ceilingName");
        return ceilingRepository.findAll()
                .stream()
                .sorted((a, b) -> a.getCeilingName().compareToIgnoreCase(b.getCeilingName()))
                .map(c -> new CabinCeilingResponseDTO(c.getId(), c.getCeilingName(), c.getPrice()))
                .collect(Collectors.toList());
    }

    @Transactional
    public CabinCeilingResponseDTO createCeiling(CabinCeilingRequestDTO request) {
        String name = sanitize(request.getCeilingName());
        log.info("Creating new cabin ceiling: {}", name);

        ceilingRepository.findByCeilingNameIgnoreCase(name).ifPresent(c -> {
            throw new IllegalArgumentException("Ceiling with this name already exists");
        });

        CabinCeiling ceiling = new CabinCeiling();
        ceiling.setCeilingName(name);
        ceiling.setPrice(request.getPrice());

        CabinCeiling saved = ceilingRepository.save(ceiling);
        return new CabinCeilingResponseDTO(saved.getId(), saved.getCeilingName(), saved.getPrice());
    }

    public CabinCeilingResponseDTO getCeilingById(Integer id) {
        log.info("Fetching cabin ceiling by ID: {}", id);
        CabinCeiling ceiling = ceilingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ceiling not found with ID: " + id));
        return new CabinCeilingResponseDTO(ceiling.getId(), ceiling.getCeilingName(), ceiling.getPrice());
    }

    @Transactional
    public CabinCeilingResponseDTO updateCeiling(Integer id, CabinCeilingRequestDTO request) {
        String name = sanitize(request.getCeilingName());
        log.info("Updating cabin ceiling ID {} with new data", id);

        CabinCeiling ceiling = ceilingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ceiling not found with ID: " + id));

        ceilingRepository.findByCeilingNameIgnoreCase(name).ifPresent(existing -> {
            if (!Objects.equals(existing.getId(), id)) {
                throw new IllegalArgumentException("Ceiling with this name already exists");
            }
        });

        ceiling.setCeilingName(name);
        ceiling.setPrice(request.getPrice());

        CabinCeiling updated = ceilingRepository.save(ceiling);
        return new CabinCeilingResponseDTO(updated.getId(), updated.getCeilingName(), updated.getPrice());
    }

    public void deleteCeiling(Integer id) {
        log.warn("Deleting cabin ceiling with ID: {}", id);
        CabinCeiling ceiling = ceilingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ceiling not found with ID: " + id));
        ceilingRepository.delete(ceiling);
    }

    private String sanitize(String input) {
        return StringEscapeUtils.escapeHtml4(input.trim());
    }
}
