package com.aibi.neerp.amc.quatation.renewal.repository;

import com.aibi.neerp.amc.quatation.renewal.entity.RevisedRenewalAmcQuotation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RevisedRenewalAmcQuotationRepository extends JpaRepository<RevisedRenewalAmcQuotation, Integer> {

	long countByAmcRenewalQuotation_RenewalQuaId(Integer renewalQuaId);

	List<RevisedRenewalAmcQuotation> findAllByAmcRenewalQuotation_RenewalQuaIdOrderByRevisedRenewalIdDesc(
			Integer quotationId);


}
