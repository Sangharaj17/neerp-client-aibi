package com.aibi.neerp.modernization.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.modernization.entity.Modernization;

@Repository
public interface ModernizationRepository extends JpaRepository<Modernization, Integer> {
	
	@Query("SELECT COALESCE(MAX(m.id), 0) FROM Modernization m")
    Integer findMaxId();
	
	
	 @Query("""
		        SELECT DISTINCT m
		        FROM Modernization m
		        LEFT JOIN m.lead l
		        WHERE (
		            :search IS NULL OR :search = '' OR
		            LOWER(l.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(l.siteName) LIKE LOWER(CONCAT('%', :search, '%'))
		        )
		        AND (
		            :dateSearch IS NULL OR :dateSearch = '' OR
		            m.quotationDate = CAST(:dateSearch AS date)
		        )
		    """)
		    Page<Modernization> searchAll(
		            @Param("search") String search,
		            @Param("dateSearch") String dateSearch,
		            Pageable pageable
		    );


	 @Query("SELECT m FROM Modernization m LEFT JOIN FETCH m.details WHERE m.id = :id")
	 Optional<Modernization> findByIdWithDetails(@Param("id") Integer id);
	
}
