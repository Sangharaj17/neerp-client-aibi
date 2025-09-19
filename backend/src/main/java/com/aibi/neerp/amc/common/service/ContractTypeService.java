package com.aibi.neerp.amc.common.service;

import org.springframework.stereotype.Service;

import com.aibi.neerp.amc.common.dto.ContractTypeRequestDto;
import com.aibi.neerp.amc.common.dto.ContractTypeResponseDto;
import com.aibi.neerp.amc.common.entity.ContractType;
import com.aibi.neerp.amc.common.repository.ContractTypeRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContractTypeService {

    private final ContractTypeRepository repository;

    public ContractTypeService(ContractTypeRepository repository) {
        this.repository = repository;
    }

    public ContractTypeResponseDto create(ContractTypeRequestDto dto) {
        ContractType type = new ContractType();
        type.setName(dto.getName());
        ContractType saved = repository.save(type);
        return new ContractTypeResponseDto(saved.getId(), saved.getName());
    }

    public ContractTypeResponseDto update(Long id, ContractTypeRequestDto dto) {
        ContractType type = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ContractType not found with id: " + id));
        type.setName(dto.getName());
        ContractType saved = repository.save(type);
        return new ContractTypeResponseDto(saved.getId(), saved.getName());
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public ContractTypeResponseDto getById(Long id) {
        ContractType type = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ContractType not found with id: " + id));
        return new ContractTypeResponseDto(type.getId(), type.getName());
    }

    public List<ContractTypeResponseDto> getAll() {
        return repository.findAll()
                .stream()
                .map(t -> new ContractTypeResponseDto(t.getId(), t.getName()))
                .collect(Collectors.toList());
    }
}
