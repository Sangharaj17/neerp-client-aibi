package com.aibi.neerp.modernization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.aibi.neerp.modernization.entity.ModernizationDetail;
import java.util.List;

@Repository
public interface ModernizationDetailRepository extends JpaRepository<ModernizationDetail, Integer> {

    // ✅ Fetch all details for a specific quotation
    List<ModernizationDetail> findByModernization_Id(Integer modernizationId);

	void deleteByModernizationId(Integer id);
}
