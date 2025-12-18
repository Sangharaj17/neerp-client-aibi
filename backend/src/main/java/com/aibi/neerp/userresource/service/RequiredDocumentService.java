package com.aibi.neerp.userresource.service;

import com.aibi.neerp.userresource.entity.RequiredDocument;
import com.aibi.neerp.userresource.repository.RequiredDocumentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class RequiredDocumentService {

    @Autowired
    private RequiredDocumentRepository requiredDocumentRepository;

    public RequiredDocument createRequiredDocument(RequiredDocument requiredDocument) {
        try {
            // Check for duplicate document name (case-insensitive)
            if (requiredDocument.getDocumentName() != null &&
                    requiredDocumentRepository.existsByDocumentName(requiredDocument.getDocumentName().trim())) {
                throw new IllegalArgumentException(
                        "Document with name '" + requiredDocument.getDocumentName() + "' already exists");
            }
            RequiredDocument saved = requiredDocumentRepository.save(requiredDocument);
            log.info("Required document created successfully with ID: {}", saved.getDocumentId());
            return saved;
        } catch (Exception e) {
            log.error("Error creating required document", e);
            throw e;
        }
    }

    public List<RequiredDocument> getAllRequiredDocuments() {
        return requiredDocumentRepository.findAll();
    }

    public RequiredDocument getRequiredDocumentById(Integer id) {
        Optional<RequiredDocument> document = requiredDocumentRepository.findById(id);
        return document.orElse(null);
    }

    public RequiredDocument updateRequiredDocument(Integer id, RequiredDocument updated) {
        return requiredDocumentRepository.findById(id)
                .map(existing -> {
                    if (updated.getDocumentName() != null) {
                        existing.setDocumentName(updated.getDocumentName());
                    }
                    return requiredDocumentRepository.save(existing);
                })
                .orElse(null);
    }

    public void deleteRequiredDocument(Integer id) {
        requiredDocumentRepository.deleteById(id);
    }
}
