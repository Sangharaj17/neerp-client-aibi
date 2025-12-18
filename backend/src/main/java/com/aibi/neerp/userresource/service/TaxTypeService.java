package com.aibi.neerp.userresource.service;

import com.aibi.neerp.userresource.entity.TaxType;
import com.aibi.neerp.userresource.repository.TaxTypeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class TaxTypeService {

    @Autowired
    private TaxTypeRepository taxTypeRepository;

    public TaxType createTaxType(TaxType taxType) {
        try {
            // Check for duplicate tax name (case-insensitive)
            if (taxType.getTaxName() != null &&
                    taxTypeRepository.existsByTaxName(taxType.getTaxName().trim())) {
                throw new IllegalArgumentException("Tax type with name '" + taxType.getTaxName() + "' already exists");
            }
            TaxType saved = taxTypeRepository.save(taxType);
            log.info("Tax type created successfully with ID: {}", saved.getTaxTypeId());
            return saved;
        } catch (Exception e) {
            log.error("Error creating tax type", e);
            throw e;
        }
    }

    public List<TaxType> getAllTaxTypes() {
        return taxTypeRepository.findAll();
    }

    public TaxType getTaxTypeById(Integer id) {
        Optional<TaxType> taxType = taxTypeRepository.findById(id);
        return taxType.orElse(null);
    }

    public TaxType updateTaxType(Integer id, TaxType updated) {
        return taxTypeRepository.findById(id)
                .map(existing -> {
                    if (updated.getTaxName() != null) {
                        existing.setTaxName(updated.getTaxName());
                    }
                    if (updated.getTaxPercentage() != null) {
                        existing.setTaxPercentage(updated.getTaxPercentage());
                    }
                    return taxTypeRepository.save(existing);
                })
                .orElse(null);
    }

    public void deleteTaxType(Integer id) {
        taxTypeRepository.deleteById(id);
    }
}
