package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.dto.CounterFrameTypeRequestDTOold;
import com.aibi.neerp.componentpricing.dto.CounterFrameTypeResponseDTOold;
import com.aibi.neerp.componentpricing.entity.CounterFrameTypeOld;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.componentpricing.repository.CounterFrameTypeRepositoryOld;
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
public class CounterFrameTypeServiceold {

    private final CounterFrameTypeRepositoryOld repository;

    @Transactional(readOnly = true)
    public List<CounterFrameTypeResponseDTOold> findAll() {
        log.info("Fetching all Counter Frame Types sorted by name ascending");
        return repository.findAll()
                .stream()
                .sorted(Comparator.comparing(CounterFrameTypeOld::getId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse<CounterFrameTypeResponseDTOold> create(CounterFrameTypeRequestDTOold dto) {
        log.info("Creating new Counter Frame Type: {}", dto.getFrameTypeName());

        CounterFrameTypeOld entity = CounterFrameTypeOld.builder()
                .frameTypeName(sanitize(dto.getFrameTypeName()))
                .build();

        CounterFrameTypeOld saved = repository.save(entity);
        return new ApiResponse<>(true, "Counter Frame Type created successfully", mapToResponse(saved));
    }

    @Transactional
    public ApiResponse<CounterFrameTypeResponseDTOold> update(Integer id, CounterFrameTypeRequestDTOold dto) {
        log.info("Updating Counter Frame Type ID: {}", id);

        CounterFrameTypeOld entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Counter Frame Type not found with ID: " + id));

        entity.setFrameTypeName(sanitize(dto.getFrameTypeName()));
        CounterFrameTypeOld updated = repository.save(entity);

        return new ApiResponse<>(true, "Counter Frame Type updated successfully", mapToResponse(updated));
    }

    @Transactional
    public ApiResponse<String> delete(Integer id) {
        log.warn("Deleting Counter Frame Type ID: {}", id);

        CounterFrameTypeOld entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Counter Frame Type not found with ID: " + id));

        repository.delete(entity);
        return new ApiResponse<>(true, "Counter Frame Type deleted successfully", null);
    }

    private String sanitize(String input) {
        return Encode.forHtmlContent(input.trim());
    }

    private CounterFrameTypeResponseDTOold mapToResponse(CounterFrameTypeOld entity) {
        return CounterFrameTypeResponseDTOold.builder()
                .id(entity.getId())
                .frameTypeName(Encode.forHtml(entity.getFrameTypeName()))
                .build();
    }
}
