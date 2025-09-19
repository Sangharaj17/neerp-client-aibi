package com.aibi.neerp.leadmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.leadmanagement.entity.LiftQuantity;

@Repository
public interface LiftQuantityRepository extends JpaRepository<LiftQuantity, Integer> {

	boolean existsByQuantity(Integer qty);}

