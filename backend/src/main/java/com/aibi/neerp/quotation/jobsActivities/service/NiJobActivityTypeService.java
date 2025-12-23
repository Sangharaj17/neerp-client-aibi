package com.aibi.neerp.quotation.jobsActivities.service;


import com.aibi.neerp.quotation.jobsActivities.entity.NiJobActivityType;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityTypeRequestDTO;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityTypeResponseDTO;
import com.aibi.neerp.quotation.jobsActivities.repository.NiJobActivityTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NiJobActivityTypeService {

    private final NiJobActivityTypeRepository repository;

    public JobActivityTypeResponseDTO create(JobActivityTypeRequestDTO request) {
        log.info("Creating JobActivityType: {}", request.getTypeName());

        if (repository.existsByTypeNameIgnoreCase(request.getTypeName())) {
            throw new IllegalArgumentException("Activity type already exists");
        }

        NiJobActivityType entity = NiJobActivityType.builder()
                .typeName(request.getTypeName())
                .status(request.getStatus())
                .build();

        repository.save(entity);
        return mapToResponse(entity);
    }

    public JobActivityTypeResponseDTO update(Long id, JobActivityTypeRequestDTO request) {
        log.info("Updating JobActivityType id={}", id);


        NiJobActivityType entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity type not found"));

        entity.setTypeName(request.getTypeName());
        entity.setStatus(request.getStatus());

        repository.save(entity);
        return mapToResponse(entity);
    }

    public JobActivityTypeResponseDTO getById(Long id) {

        NiJobActivityType entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity type not found"));

        return mapToResponse(entity);
    }

    public List<JobActivityTypeResponseDTO> getAll() {
        return repository.findAll(Sort.by(Sort.Direction.ASC, "typeName"))
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void delete(Long id) {

        NiJobActivityType entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity type not found"));

        repository.delete(entity);
        log.info("Deleted JobActivityType id={}", id);
    }

    private JobActivityTypeResponseDTO mapToResponse(
            NiJobActivityType entity) {
        return JobActivityTypeResponseDTO.builder()
                .id(entity.getId())
                .typeName(entity.getTypeName())
                .status(entity.getStatus())
                .build();
    }
}

