package com.aibi.neerp.quotation.jobsActivities.repository;

import com.aibi.neerp.quotation.jobsActivities.entity.NiJobActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NiJobActivityTypeRepository
        extends JpaRepository<NiJobActivityType, Long> {

    boolean existsByTypeNameIgnoreCase(String typeName);
}
