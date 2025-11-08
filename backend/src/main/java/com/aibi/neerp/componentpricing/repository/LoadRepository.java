package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.Load;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoadRepository extends JpaRepository<Load, Integer> {
}

