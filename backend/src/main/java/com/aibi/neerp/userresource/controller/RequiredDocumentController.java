package com.aibi.neerp.userresource.controller;

import com.aibi.neerp.userresource.entity.RequiredDocument;
import com.aibi.neerp.userresource.service.RequiredDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/required-documents")
@CrossOrigin
public class RequiredDocumentController {

    @Autowired
    private RequiredDocumentService requiredDocumentService;

    @PostMapping
    public ResponseEntity<RequiredDocument> createRequiredDocument(@RequestBody RequiredDocument requiredDocument) {
        try {
            // Validate required fields
            if (requiredDocument.getDocumentName() == null || requiredDocument.getDocumentName().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            RequiredDocument saved = requiredDocumentService.createRequiredDocument(requiredDocument);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<RequiredDocument>> getAllRequiredDocuments() {
        return ResponseEntity.ok(requiredDocumentService.getAllRequiredDocuments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequiredDocument> getRequiredDocumentById(@PathVariable Integer id) {
        RequiredDocument document = requiredDocumentService.getRequiredDocumentById(id);
        if (document != null) {
            return ResponseEntity.ok(document);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<RequiredDocument> updateRequiredDocument(@PathVariable Integer id, @RequestBody RequiredDocument requiredDocument) {
        RequiredDocument updated = requiredDocumentService.updateRequiredDocument(id, requiredDocument);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequiredDocument(@PathVariable Integer id) {
        requiredDocumentService.deleteRequiredDocument(id);
        return ResponseEntity.noContent().build();
    }
}

