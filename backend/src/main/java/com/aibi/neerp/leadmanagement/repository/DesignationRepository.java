package com.aibi.neerp.leadmanagement.repository;

import com.aibi.neerp.leadmanagement.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Integer> {
}
