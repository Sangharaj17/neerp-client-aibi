package com.aibi.neerp.rolebackmanagement.repository;

import com.aibi.neerp.rolebackmanagement.entity.RolePermission;
import com.aibi.neerp.rolebackmanagement.entity.Role;
import com.aibi.neerp.rolebackmanagement.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {
    List<RolePermission> findByRole(Role role);
    List<RolePermission> findByRole_RoleId(Integer roleId);
    void deleteByRole_RoleId(Integer roleId);
}
