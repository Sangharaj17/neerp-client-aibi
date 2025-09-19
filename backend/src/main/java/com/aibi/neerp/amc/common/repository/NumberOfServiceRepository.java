package com.aibi.neerp.amc.common.repository;

import com.aibi.neerp.amc.common.entity.NumberOfService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NumberOfServiceRepository extends JpaRepository<NumberOfService, Long> {

    boolean existsByValue(Integer value);
}
