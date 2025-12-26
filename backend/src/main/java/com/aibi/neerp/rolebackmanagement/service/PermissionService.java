package com.aibi.neerp.rolebackmanagement.service;

import com.aibi.neerp.rolebackmanagement.dto.PermissionResponseDto;
import com.aibi.neerp.rolebackmanagement.entity.Permission;
import com.aibi.neerp.rolebackmanagement.entity.Role;
import com.aibi.neerp.rolebackmanagement.entity.RolePermission;
import com.aibi.neerp.rolebackmanagement.repository.PermissionRepository;
import com.aibi.neerp.rolebackmanagement.repository.RolePermissionRepository;
import com.aibi.neerp.rolebackmanagement.repository.RoleRepository;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final EmployeeRepository employeeRepository;

    public PermissionService(PermissionRepository permissionRepository,
            RoleRepository roleRepository,
            RolePermissionRepository rolePermissionRepository,
            EmployeeRepository employeeRepository) {
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, List<PermissionResponseDto>> listPermissionsGrouped() {
        List<Permission> all = permissionRepository.findAllByOrderByModuleNameAscFeatureNameAsc();
        return all.stream()
                .map(this::mapToDto)
                .collect(Collectors.groupingBy(
                        PermissionResponseDto::getModuleName,
                        LinkedHashMap::new,
                        Collectors.toList()));
    }

    @Transactional(readOnly = true)
    public List<Long> getPermissionIdsForRole(Integer roleId) {
        return rolePermissionRepository.findByRole_RoleId(roleId).stream()
                .map(rp -> {
                    Permission permission = rp.getPermission();
                    if (permission == null && rp.getModuleName() != null && rp.getFeatureName() != null) {
                        permission = permissionRepository.findByModuleNameAndFeatureName(
                                rp.getModuleName(),
                                rp.getFeatureName());
                    }
                    return permission != null ? permission.getId() : null;
                })
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    @Transactional
    public void assignPermissionsToRole(Integer roleId, List<Long> permissionIds) {
        if (roleId == null) {
            throw new IllegalArgumentException("Role id is required");
        }
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Role not found with id: " + roleId));

        // Remove existing assignments
        rolePermissionRepository.deleteByRole_RoleId(roleId);

        if (permissionIds == null || permissionIds.isEmpty()) {
            return;
        }

        List<Permission> permissions = permissionRepository.findAllById(permissionIds);
        List<RolePermission> rolePermissions = permissions.stream()
                .map(permission -> {
                    RolePermission rp = new RolePermission();
                    rp.setRole(role);
                    rp.setPermission(permission);
                    rp.setModuleName(permission.getModuleName());
                    rp.setFeatureName(permission.getFeatureName());
                    rp.setActive(true);
                    return rp;
                })
                .collect(Collectors.toList());
        rolePermissionRepository.saveAll(rolePermissions);
    }

    /**
     * Get permissions for a user by userId (employeeId).
     * Returns a list of module_name and feature_name pairs that the user has access
     * to.
     * Only returns permissions that exist in the current tbl_permission (synced
     * from admin).
     */
    @Transactional(readOnly = true)
    public List<Map<String, String>> getUserPermissions(Integer userId) {
        try {
            if (userId == null) {
                return new java.util.ArrayList<>();
            }

            Optional<Employee> employeeOpt = employeeRepository.findById(userId);
            if (employeeOpt.isEmpty()) {
                return new java.util.ArrayList<>();
            }

            Employee employee = employeeOpt.get();

            // Access role to trigger lazy loading within transaction
            Role role = employee.getRole();
            if (role == null) {
                return new java.util.ArrayList<>();
            }

            Integer roleId = role.getRoleId();
            if (roleId == null) {
                return new java.util.ArrayList<>();
            }

            // Get all valid permissions from tbl_permission (synced from admin)
            // This ensures we only return permissions that the client is currently allowed
            // to have
            Set<String> validPermissionKeys = permissionRepository.findAll().stream()
                    .filter(p -> p.getModuleName() != null && p.getFeatureName() != null)
                    .map(p -> p.getModuleName() + "|" + p.getFeatureName())
                    .collect(Collectors.toSet());

            List<RolePermission> rolePermissions = rolePermissionRepository.findByRole_RoleId(roleId);

            List<Map<String, String>> permissions = new java.util.ArrayList<>();
            for (RolePermission rp : rolePermissions) {
                String moduleName = null;
                String featureName = null;

                // Try to get from permission entity first
                if (rp.getPermission() != null) {
                    moduleName = rp.getPermission().getModuleName();
                    featureName = rp.getPermission().getFeatureName();
                } else if (rp.getModuleName() != null && rp.getFeatureName() != null) {
                    // Fallback to direct fields in RolePermission
                    moduleName = rp.getModuleName();
                    featureName = rp.getFeatureName();
                }

                // Only include if this permission still exists in tbl_permission (valid from
                // admin)
                if (moduleName != null && featureName != null) {
                    String permissionKey = moduleName + "|" + featureName;
                    if (validPermissionKeys.contains(permissionKey)) {
                        Map<String, String> perm = new LinkedHashMap<>();
                        perm.put("moduleName", moduleName);
                        perm.put("featureName", featureName);
                        permissions.add(perm);
                    }
                    // If not in validPermissionKeys, this is an orphaned permission - skip it
                }
            }

            return permissions;
        } catch (Exception e) {
            System.err.println("[PermissionService] Error in getUserPermissions: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private PermissionResponseDto mapToDto(Permission permission) {
        return PermissionResponseDto.builder()
                .id(permission.getId())
                .moduleId(permission.getModuleId())
                .moduleName(Optional.ofNullable(permission.getModuleName()).orElse("Unknown Module"))
                .featureId(permission.getFeatureId())
                .featureName(Optional.ofNullable(permission.getFeatureName()).orElse("Feature"))
                .build();
    }
}
