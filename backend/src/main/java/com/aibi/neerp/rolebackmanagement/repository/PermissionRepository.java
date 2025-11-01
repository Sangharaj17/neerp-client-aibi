package com.aibi.neerp.rolebackmanagement.repository;

import com.aibi.neerp.rolebackmanagement.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    List<Permission> findAllByOrderByModuleNameAscFeatureNameAsc();
    List<Permission> findByModuleId(Long moduleId);
    List<Permission> findByFeatureId(Integer featureId);
}
