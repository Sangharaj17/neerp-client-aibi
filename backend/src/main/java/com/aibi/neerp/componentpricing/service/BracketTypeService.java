package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.BracketTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.BracketTypeResponseDTO;
import com.aibi.neerp.componentpricing.entity.Bracket;
import com.aibi.neerp.componentpricing.entity.BracketType;
import com.aibi.neerp.componentpricing.repository.BracketRepository;
import com.aibi.neerp.componentpricing.repository.BracketTypeRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BracketTypeService {

    private final BracketTypeRepository bracketTypeRepository;
    private final BracketRepository bracketRepository;

    public List<BracketTypeResponseDTO> getAllBracketTypes(String sortBy) {
        log.info("Fetching all bracket types sorted by {}", sortBy);
        Comparator<BracketType> comparator = Comparator.comparing(BracketType::getName, String.CASE_INSENSITIVE_ORDER);

        if ("id".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparingInt(BracketType::getId);
        }

        return bracketTypeRepository.findAll()
                .stream()
                .sorted(comparator)
                .map(bt -> new BracketTypeResponseDTO(bt.getId(), bt.getName()))
                .collect(Collectors.toList());
    }

    public BracketTypeResponseDTO getBracketTypeById(int id) {
        log.info("Fetching bracket type with ID {}", id);
        BracketType bracketType = bracketTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bracket Type not found with ID: " + id));
        return new BracketTypeResponseDTO(bracketType.getId(), bracketType.getName());
    }

    @Transactional
    public BracketTypeResponseDTO createBracketType(BracketTypeRequestDTO requestDTO) {
        String sanitizedName = StringEscapeUtils.escapeHtml4(requestDTO.getName().trim());

        log.info("Creating new bracket type: {}", sanitizedName);

        bracketTypeRepository.findByNameIgnoreCase(sanitizedName).ifPresent(bt -> {
            log.error("Duplicate bracket type: {}", sanitizedName);
            throw new IllegalArgumentException("Bracket Type already exists: " + sanitizedName);
        });

        BracketType bracketType = new BracketType();
        bracketType.setName(sanitizedName);

        BracketType saved = bracketTypeRepository.save(bracketType);
        return new BracketTypeResponseDTO(saved.getId(), saved.getName());
    }

    @Transactional
    public BracketTypeResponseDTO updateBracketType(int id, BracketTypeRequestDTO requestDTO) {
        String sanitizedName = StringEscapeUtils.escapeHtml4(requestDTO.getName().trim());

        log.info("Updating bracket type ID {} to {}", id, sanitizedName);

        BracketType bracketType = bracketTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bracket Type not found with ID: " + id));

        bracketTypeRepository.findByNameIgnoreCase(sanitizedName)
                .filter(bt -> bt.getId() != id)
                .ifPresent(bt -> {
                    log.error("Duplicate bracket type name during update: {}", sanitizedName);
                    throw new IllegalArgumentException("Bracket Type already exists: " + sanitizedName);
                });

        bracketType.setName(sanitizedName);
        BracketType updated = bracketTypeRepository.save(bracketType);

        // Update all Brackets with this type
        List<Bracket> brackets = bracketRepository.findByBracketTypeId(id);
        brackets.forEach(b -> b.getBracketType().setName(sanitizedName));
        bracketRepository.saveAll(brackets);

        log.info("Bracket Type updated successfully with ID {}", id);

        return new BracketTypeResponseDTO(updated.getId(), updated.getName());
    }

    @Transactional
    public void deleteBracketType(int id) {
        log.warn("Deleting bracket type ID {}", id);
        BracketType bracketType = bracketTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bracket Type not found with ID: " + id));
        bracketTypeRepository.delete(bracketType);
    }
}
