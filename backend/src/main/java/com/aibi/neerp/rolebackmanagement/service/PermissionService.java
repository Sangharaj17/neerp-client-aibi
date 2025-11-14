package com.aibi.neerp.rolebackmanagement.service;

import com.aibi.neerp.rolebackmanagement.dto.PermissionResponseDto;
import com.aibi.neerp.rolebackmanagement.entity.Permission;
import com.aibi.neerp.rolebackmanagement.entity.Role;
import com.aibi.neerp.rolebackmanagement.entity.RolePermission;
import com.aibi.neerp.rolebackmanagement.repository.PermissionRepository;
import com.aibi.neerp.rolebackmanagement.repository.RolePermissionRepository;
import com.aibi.neerp.rolebackmanagement.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;

    public PermissionService(PermissionRepository permissionRepository,
                             RoleRepository roleRepository,
                             RolePermissionRepository rolePermissionRepository) {
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, List<PermissionResponseDto>> listPermissionsGrouped() {
        List<Permission> all = permissionRepository.findAllByOrderByModuleNameAscFeatureNameAsc();
        return all.stream()
                .map(this::mapToDto)
                .collect(Collectors.groupingBy(
                        PermissionResponseDto::getModuleName,
                        LinkedHashMap::new,
                        Collectors.toList()
                ));
    }

    @Transactional(readOnly = true)
    public List<Long> getPermissionIdsForRole(Integer roleId) {
        return rolePermissionRepository.findByRole_RoleId(roleId).stream()
                .map(rp -> {
                    Permission permission = rp.getPermission();
                    if (permission == null && rp.getModuleName() != null && rp.getFeatureName() != null) {
                        permission = permissionRepository.findByModuleNameAndFeatureName(
                                rp.getModuleName(),
                                rp.getFeatureName()
                        );
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

