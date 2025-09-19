package com.aibi.neerp.amc.common.repository;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.common.entity.JobActivityType;

@Repository
public interface JobActivityTypeRepository extends JpaRepository<JobActivityType, Long> {
    boolean existsByActivityNameIgnoreCase(String activityName);

	Collection<Object> findByActivityName(String name);
}

