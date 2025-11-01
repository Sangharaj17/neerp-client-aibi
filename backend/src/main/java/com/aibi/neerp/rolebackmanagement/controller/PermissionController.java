package com.aibi.neerp.rolebackmanagement.controller;

import com.aibi.neerp.rolebackmanagement.entity.Permission;
import com.aibi.neerp.rolebackmanagement.entity.Role;
import com.aibi.neerp.rolebackmanagement.entity.RolePermission;
import com.aibi.neerp.rolebackmanagement.repository.PermissionRepository;
import com.aibi.neerp.rolebackmanagement.repository.RolePermissionRepository;
import com.aibi.neerp.rolebackmanagement.repository.RoleRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {
    @Autowired PermissionRepository permissionRepository;
    @Autowired RoleRepository roleRepository;
    @Autowired RolePermissionRepository rolePermissionRepository;

    /**
     * List all permissions, grouped by module_name.
     */
    @GetMapping
    public Map<String, List<Permission>> listPermissionsGrouped() {
        List<Permission> all = permissionRepository.findAllByOrderByModuleNameAscFeatureNameAsc();
        return all.stream().collect(Collectors.groupingBy(Permission::getModuleName, LinkedHashMap::new, Collectors.toList()));
    }

    /**
     * List all permissions assigned to a role (by role id). Returns list of permission ids.
     */
    @GetMapping("/role/{roleId}")
    public List<Long> rolePermissions(@PathVariable Integer roleId) {
        return rolePermissionRepository.findByRole_RoleId(roleId)
                .stream()
                .filter(rp -> Boolean.TRUE.equals(rp.getActive()))
                .map(rp -> rp.getPermission().getId())
                .collect(Collectors.toList());
    }

    /**
     * Assign permissions to a role - replaces all.
     */
    @PostMapping("/role/{roleId}")
    public ResponseEntity<?> assignRolePermissions(@PathVariable Integer roleId, @RequestBody List<Long> permissionIds) {
        Optional<Role> roleOpt = roleRepository.findById(roleId);
        if (roleOpt.isEmpty()) return ResponseEntity.notFound().build();
        Role role = roleOpt.get();
        // Remove old assignments
        rolePermissionRepository.deleteByRole_RoleId(roleId);
        // Add new
        List<Permission> allPerms = permissionRepository.findAllById(permissionIds);
        List<RolePermission> newLinks = allPerms.stream()
                .map(p -> {
                    RolePermission rp = new RolePermission();
                    rp.setRole(role);
                    rp.setPermission(p);
                    rp.setActive(true);
                    return rp;
                }).collect(Collectors.toList());
        rolePermissionRepository.saveAll(newLinks);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
