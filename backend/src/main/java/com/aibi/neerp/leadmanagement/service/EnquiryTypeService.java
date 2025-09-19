package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.dto.EnquiryTypeRequestDto;
import com.aibi.neerp.leadmanagement.dto.EnquiryTypeResponseDto;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import com.aibi.neerp.leadmanagement.repository.EnquiryTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnquiryTypeService {

    @Autowired
    private EnquiryTypeRepository enquiryTypeRepository;

    public EnquiryTypeResponseDto create(EnquiryTypeRequestDto dto) {
        EnquiryType entity = new EnquiryType();
        entity.setEnquiryTypeName(dto.getEnquiryTypeName());

        EnquiryType saved = enquiryTypeRepository.save(entity);
        return new EnquiryTypeResponseDto(saved.getEnquiryTypeId(), saved.getEnquiryTypeName());
    }

    public List<EnquiryTypeResponseDto> getAll() {
        return enquiryTypeRepository.findAll().stream()
                .map(e -> new EnquiryTypeResponseDto(e.getEnquiryTypeId(), e.getEnquiryTypeName()))
                .collect(Collectors.toList());
    }

    public EnquiryTypeResponseDto update(Integer id, EnquiryTypeRequestDto dto) {
        EnquiryType entity = enquiryTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EnquiryType not found"));

        entity.setEnquiryTypeName(dto.getEnquiryTypeName());
        EnquiryType updated = enquiryTypeRepository.save(entity);

        return new EnquiryTypeResponseDto(updated.getEnquiryTypeId(), updated.getEnquiryTypeName());
    }

    @Transactional
    public void delete(Integer id) {
        EnquiryType enquiryType = enquiryTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EnquiryType not found with id: " + id));

        try {
            enquiryTypeRepository.delete(enquiryType);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot delete EnquiryType because it is used in other records.");
        }
    }
}
