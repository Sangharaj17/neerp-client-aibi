package com.aibi.neerp.amc.quatation.initial.repository;

import com.aibi.neerp.amc.quatation.initial.entity.RevisedAmcQuotation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RevisedAmcQuotationRepository extends JpaRepository<RevisedAmcQuotation, Integer> {
    // Basic CRUD is already provided by JpaRepository
	
    long countByAmcQuotation_AmcQuatationId(Integer amcQuatationId);
    
    List<RevisedAmcQuotation> findAllByAmcQuotation_AmcQuatationIdOrderByRevisedQuatationIdDesc(Integer amcQuotationId);


    @Query("SELECT r FROM RevisedAmcQuotation r " +
            "JOIN FETCH r.customer c " +
            "JOIN FETCH r.site s " +
            "WHERE r.isFinal = 1 AND r.jobStatus = 0")
     List<RevisedAmcQuotation> findFinalPendingRevisedAmcQuotations();
}
