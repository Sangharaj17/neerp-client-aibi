package com.aibi.neerp.leadmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.leadmanagement.entity.FloorDesignation;

@Repository
public interface FloorDesignationRepository extends JpaRepository<FloorDesignation, Integer> {}

