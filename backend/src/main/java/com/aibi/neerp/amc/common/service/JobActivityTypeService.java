package com.aibi.neerp.amc.common.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.aibi.neerp.amc.common.dto.JobActivityTypeRequestDto;
import com.aibi.neerp.amc.common.dto.JobActivityTypeResponseDto;
import com.aibi.neerp.amc.common.entity.JobActivityType;
import com.aibi.neerp.amc.common.repository.JobActivityTypeRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobActivityTypeService {

    private final JobActivityTypeRepository repository;

    public JobActivityTypeResponseDto create(JobActivityTypeRequestDto requestDto) {
        log.info("Creating JobActivityType with name: {}", requestDto.getActivityName());

        if (repository.existsByActivityNameIgnoreCase(requestDto.getActivityName())) {
            log.warn("Activity name '{}' already exists", requestDto.getActivityName());
            throw new IllegalArgumentException("Activity name already exists");
        }

        JobActivityType entity = JobActivityType.builder()
                .activityName(requestDto.getActivityName())
                .description(requestDto.getDescription())
                .isActive(requestDto.getIsActive() != null ? requestDto.getIsActive() : true)
                .build();

        JobActivityType saved = repository.save(entity);
        log.info("Created JobActivityType with id: {}", saved.getId());
        return mapToResponseDto(saved);
    }

    public JobActivityTypeResponseDto update(Long id, JobActivityTypeRequestDto requestDto) {
        log.info("Updating JobActivityType with id: {}", id);

        JobActivityType entity = repository.findById(id)
                .orElseThrow(() -> {
                    log.error("JobActivityType not found with id {}", id);
                    return new EntityNotFoundException("JobActivityType not found with id " + id);
                });

        entity.setActivityName(requestDto.getActivityName());
        entity.setDescription(requestDto.getDescription());
        entity.setIsActive(requestDto.getIsActive());

        JobActivityType updated = repository.save(entity);
        log.info("Updated JobActivityType with id: {}", updated.getId());
        return mapToResponseDto(updated);
    }

    public void delete(Long id) {
        log.info("Deleting JobActivityType with id: {}", id);

        if (!repository.existsById(id)) {
            log.error("JobActivityType not found with id {}", id);
            throw new EntityNotFoundException("JobActivityType not found with id " + id);
        }
        repository.deleteById(id);
        log.info("Deleted JobActivityType with id: {}", id);
    }

    public JobActivityTypeResponseDto getById(Long id) {
        log.debug("Fetching JobActivityType with id: {}", id);

        JobActivityType entity = repository.findById(id)
                .orElseThrow(() -> {
                    log.error("JobActivityType not found with id {}", id);
                    return new EntityNotFoundException("JobActivityType not found with id " + id);
                });

        return mapToResponseDto(entity);
    }

    public List<JobActivityTypeResponseDto> getAll() {
        log.debug("Fetching all JobActivityTypes");
        return repository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    private JobActivityTypeResponseDto mapToResponseDto(JobActivityType entity) {
        return JobActivityTypeResponseDto.builder()
                .id(entity.getId())
                .activityName(entity.getActivityName())
                .description(entity.getDescription())
                .isActive(entity.getIsActive())
                .build();
    }
}

