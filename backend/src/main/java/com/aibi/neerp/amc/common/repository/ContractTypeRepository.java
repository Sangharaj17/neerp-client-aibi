package com.aibi.neerp.amc.common.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aibi.neerp.amc.common.entity.ContractType;

public interface ContractTypeRepository extends JpaRepository<ContractType, Long> {

	  // Use the correct field name from entity: 'name'
    boolean existsByName(String name);

    Optional<ContractType> findByName(String name); // optional utility method
}
