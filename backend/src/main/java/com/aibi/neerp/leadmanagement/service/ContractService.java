package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.dto.ContractDto;
import com.aibi.neerp.leadmanagement.entity.Contract;
import com.aibi.neerp.leadmanagement.repository.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContractService {

    @Autowired
    private ContractRepository contractRepository;

    public List<ContractDto> getAllContracts() {
        return contractRepository.findAll()
                .stream()
                .map(contract -> new ContractDto(contract.getId(), contract.getName()))
                .collect(Collectors.toList());
    }

    public ContractDto getContractById(Integer id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + id));
        return new ContractDto(contract.getId(), contract.getName());
    }

    public ContractDto createContract(ContractDto contractDto) {
        Contract contract = new Contract();
        contract.setName(contractDto.getName());
        contract = contractRepository.save(contract);
        return new ContractDto(contract.getId(), contract.getName());
    }

    public void deleteContract(Integer id) {
        if (!contractRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contract not found with id: " + id);
        }
        contractRepository.deleteById(id);
    }
}
