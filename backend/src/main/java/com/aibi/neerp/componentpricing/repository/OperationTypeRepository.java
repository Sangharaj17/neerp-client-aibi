package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.OperationType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperationTypeRepository extends JpaRepository<OperationType, Integer> {
}
