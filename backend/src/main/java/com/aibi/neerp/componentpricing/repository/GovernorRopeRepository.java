package com.aibi.neerp.componentpricing.repository;

import com.aibi.neerp.componentpricing.entity.GovernorRope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GovernorRopeRepository extends JpaRepository<GovernorRope, Integer> {
}
