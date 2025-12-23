package com.aibi.neerp.quotation.jobs.repository;

import com.aibi.neerp.quotation.jobs.entity.NiJobDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NiJobDocumentRepository extends JpaRepository<NiJobDocument, Long> {
    long countByJob_JobIdAndStatus(Integer jobId, String status);
    List<NiJobDocument> findByJob_JobIdAndStatus(Integer jobId, String status);
}
