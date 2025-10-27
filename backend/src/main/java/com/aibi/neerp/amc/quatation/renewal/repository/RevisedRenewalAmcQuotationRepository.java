package com.aibi.neerp.amc.quatation.renewal.repository;

import com.aibi.neerp.amc.quatation.initial.entity.RevisedAmcQuotation;
import com.aibi.neerp.amc.quatation.renewal.entity.RevisedRenewalAmcQuotation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RevisedRenewalAmcQuotationRepository extends JpaRepository<RevisedRenewalAmcQuotation, Integer> {

	long countByAmcRenewalQuotation_RenewalQuaId(Integer renewalQuaId);

	List<RevisedRenewalAmcQuotation> findAllByAmcRenewalQuotation_RenewalQuaIdOrderByRevisedRenewalIdDesc(
			Integer quotationId);
	
	 @Query("SELECT r FROM RevisedRenewalAmcQuotation r " +
	            "JOIN FETCH r.customer c " +
	            "JOIN FETCH r.site s " +
	            "WHERE r.isFinal = 1 AND r.jobStatus = 0")
	     List<RevisedRenewalAmcQuotation> findFinalPendingRevisedRenewalAmcQuotations();


}
