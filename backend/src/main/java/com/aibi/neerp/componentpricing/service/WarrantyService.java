package com.aibi.neerp.componentpricing.service;

import com.aibi.neerp.componentpricing.entity.Warranty;
import com.aibi.neerp.componentpricing.repository.WarrantyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WarrantyService {

    private final WarrantyRepository warrantyRepository;

    public List<Warranty> getAllWarranties() {
        log.info("Fetching all warranties");
        return warrantyRepository.findAll();
    }

    public Warranty getWarrantyById(Integer id) {
        log.info("Fetching warranty with id {}", id);
        return warrantyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warranty not found with id " + id));
    }

    @Transactional
    public Warranty createWarranty(Warranty warranty) {
        log.info("Creating warranty with months {}", warranty.getWarrantyMonth());
        if (warrantyRepository.existsByWarrantyMonth(warranty.getWarrantyMonth())) {
            throw new RuntimeException("Warranty with " + warranty.getWarrantyMonth() + " months already exists");
        }
        return warrantyRepository.save(warranty);
    }

    @Transactional
    public Warranty updateWarranty(Integer id, Warranty updatedWarranty) {
        log.info("Updating warranty with id {}", id);
        Warranty existing = warrantyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warranty not found with id " + id));

        if (!existing.getWarrantyMonth().equals(updatedWarranty.getWarrantyMonth())
                && warrantyRepository.existsByWarrantyMonth(updatedWarranty.getWarrantyMonth())) {
            throw new RuntimeException("Warranty with " + updatedWarranty.getWarrantyMonth() + " months already exists");
        }

        existing.setWarrantyMonth(updatedWarranty.getWarrantyMonth());
        return warrantyRepository.save(existing);
    }

    @Transactional
    public void deleteWarranty(Integer id) {
        log.info("Deleting warranty with id {}", id);
        if (!warrantyRepository.existsById(id)) {
            throw new RuntimeException("Warranty not found with id " + id);
        }
        warrantyRepository.deleteById(id);
    }

    /**
     * Generate warranties from 1 to given number.
     * Clears existing warranties and resets identity before insert.
     */
    @Transactional
    public List<Warranty> generateWarranties(int totalMonths) {
        log.info("Generating warranties from 1 to {}", totalMonths);

        // clear existing records & reset identity
        warrantyRepository.truncateAndReset();

        List<Warranty> warranties = new ArrayList<>();
        for (int i = 1; i <= totalMonths; i++) {
            warranties.add(new Warranty(null, i));
        }

        return warrantyRepository.saveAll(warranties);
    }
}

