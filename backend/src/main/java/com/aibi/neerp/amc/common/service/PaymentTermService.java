package com.aibi.neerp.amc.common.service;

import com.aibi.neerp.amc.common.dto.PaymentTermDto;
import com.aibi.neerp.amc.common.entity.PaymentTerm;
import com.aibi.neerp.amc.common.repository.PaymentTermRepository;
import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentTermService {

    private final PaymentTermRepository repository;

    public PaymentTermService(PaymentTermRepository repository) {
        this.repository = repository;
    }

    public List<PaymentTermDto> getAllPaymentTerms() {
        return repository.findAll().stream()
                .map(pt -> new PaymentTermDto(pt.getId(), pt.getTermName(), pt.getDescription()))
                .collect(Collectors.toList());
    }

    public PaymentTermDto getPaymentTermById(Long id) {
        PaymentTerm pt = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PaymentTerm not found with id: " + id));
        return new PaymentTermDto(pt.getId(), pt.getTermName(), pt.getDescription());
    }

    public PaymentTermDto createPaymentTerm(PaymentTermDto dto) {
        PaymentTerm pt = new PaymentTerm();
        pt.setTermName(dto.getTermName());
        pt.setDescription(dto.getDescription());
        pt = repository.save(pt);
        return new PaymentTermDto(pt.getId(), pt.getTermName(), pt.getDescription());
    }

    public PaymentTermDto updatePaymentTerm(Long id, PaymentTermDto dto) {
        PaymentTerm existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PaymentTerm not found with id: " + id));
        existing.setTermName(dto.getTermName());
        existing.setDescription(dto.getDescription());
        existing = repository.save(existing);
        return new PaymentTermDto(existing.getId(), existing.getTermName(), existing.getDescription());
    }

    public void deletePaymentTerm(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("PaymentTerm not found with id: " + id);
        }
        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot delete PaymentTerm because it's used in other records.");
        }
    }
}
