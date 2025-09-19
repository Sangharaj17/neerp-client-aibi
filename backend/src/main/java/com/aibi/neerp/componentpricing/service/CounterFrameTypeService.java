package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.CounterFrameTypeRequestDTO;
import com.aibi.neerp.componentpricing.dto.CounterFrameTypeResponseDTO;
import com.aibi.neerp.componentpricing.entity.CounterFrameType;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.CounterFrameTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.owasp.encoder.Encode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CounterFrameTypeService {

    private final CounterFrameTypeRepository repository;

    @Transactional(readOnly = true)
    public List<CounterFrameTypeResponseDTO> findAll() {
        log.info("Fetching all Counter Frame Types sorted by name ascending");
        return repository.findAll()
                .stream()
                .sorted(Comparator.comparing(CounterFrameType::getId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse<CounterFrameTypeResponseDTO> create(CounterFrameTypeRequestDTO dto) {
        log.info("Creating new Counter Frame Type: {}", dto.getFrameTypeName());

        CounterFrameType entity = CounterFrameType.builder()
                .frameTypeName(sanitize(dto.getFrameTypeName()))
                .build();

        CounterFrameType saved = repository.save(entity);
        return new ApiResponse<>(true, "Counter Frame Type created successfully", mapToResponse(saved));
    }

    @Transactional
    public ApiResponse<CounterFrameTypeResponseDTO> update(Integer id, CounterFrameTypeRequestDTO dto) {
        log.info("Updating Counter Frame Type ID: {}", id);

        CounterFrameType entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Counter Frame Type not found with ID: " + id));

        entity.setFrameTypeName(sanitize(dto.getFrameTypeName()));
        CounterFrameType updated = repository.save(entity);

        return new ApiResponse<>(true, "Counter Frame Type updated successfully", mapToResponse(updated));
    }

    @Transactional
    public ApiResponse<String> delete(Integer id) {
        log.warn("Deleting Counter Frame Type ID: {}", id);

        CounterFrameType entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Counter Frame Type not found with ID: " + id));

        repository.delete(entity);
        return new ApiResponse<>(true, "Counter Frame Type deleted successfully", null);
    }

    private String sanitize(String input) {
        return Encode.forHtmlContent(input.trim());
    }

    private CounterFrameTypeResponseDTO mapToResponse(CounterFrameType entity) {
        return CounterFrameTypeResponseDTO.builder()
                .id(entity.getId())
                .frameTypeName(Encode.forHtml(entity.getFrameTypeName()))
                .build();
    }
}
