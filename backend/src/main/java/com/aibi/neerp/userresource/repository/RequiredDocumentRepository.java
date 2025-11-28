package com.aibi.neerp.userresource.repository;

import com.aibi.neerp.userresource.entity.RequiredDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequiredDocumentRepository extends JpaRepository<RequiredDocument, Integer> {
    boolean existsByDocumentName(String documentName);
}

