package com.aibi.neerp.amc.common.repository;

import com.aibi.neerp.amc.common.entity.PaymentTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentTermRepository extends JpaRepository<PaymentTerm, Long> {

	boolean existsByTermName(String name);
}
