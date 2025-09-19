package com.aibi.neerp.leadmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aibi.neerp.leadmanagement.entity.Contract;

public interface ContractRepository extends JpaRepository<Contract, Integer> {}
