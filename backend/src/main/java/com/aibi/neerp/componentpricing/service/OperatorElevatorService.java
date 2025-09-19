package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.OperatorElevatorRequestDTO;
import com.aibi.neerp.componentpricing.dto.OperatorElevatorResponseDTO;
import com.aibi.neerp.componentpricing.entity.OperatorElevator;
import com.aibi.neerp.componentpricing.repository.OperatorElevatorRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OperatorElevatorService {

    private final OperatorElevatorRepository repository;

    public OperatorElevatorResponseDTO createOperator(OperatorElevatorRequestDTO dto) {
        String name = sanitize(dto.getName());

        repository.findByNameIgnoreCase(name).ifPresent(op -> {
            throw new IllegalArgumentException("Operator already exists");
        });

        OperatorElevator saved = repository.save(
                OperatorElevator.builder().name(name).build()
        );

        log.info("Operator created: {}", saved.getName());
        return mapToDTO(saved);
    }

    public List<OperatorElevatorResponseDTO> getAllOperators() {
        return repository.findAll(Sort.by("id").ascending()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public OperatorElevatorResponseDTO updateOperator(Integer id, OperatorElevatorRequestDTO dto) {
        String name = sanitize(dto.getName());

        OperatorElevator existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found with id: " + id));

        repository.findByNameIgnoreCase(name).ifPresent(op -> {
            if (!op.getId().equals(id)) {
                throw new IllegalArgumentException("Operator with this name already exists");
            }
        });

        existing.setName(name);
        log.info("Operator updated: ID {} -> {}", id, name);

        return mapToDTO(existing);
    }

    public void deleteOperator(Integer id) {
        OperatorElevator existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found with id: " + id));

        repository.delete(existing);
        log.warn("Operator deleted: ID {}", id);
    }

    private OperatorElevatorResponseDTO mapToDTO(OperatorElevator entity) {
        return new OperatorElevatorResponseDTO(entity.getId(), entity.getName());
    }

    private String sanitize(String input) {
        return StringUtils.trimWhitespace(input.toUpperCase());
    }
}
