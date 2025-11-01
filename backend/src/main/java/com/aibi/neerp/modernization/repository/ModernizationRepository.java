package com.aibi.neerp.modernization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.aibi.neerp.modernization.entity.Modernization;

@Repository
public interface ModernizationRepository extends JpaRepository<Modernization, Integer> {
	
	@Query("SELECT COALESCE(MAX(m.id), 0) FROM Modernization m")
    Integer findMaxId();
}
