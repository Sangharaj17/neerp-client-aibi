package com.aibi.neerp.rolebackmanagement.controller;

import com.aibi.neerp.rolebackmanagement.dto.PermissionResponseDto;
import com.aibi.neerp.rolebackmanagement.service.PermissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    /**
     * List all permissions, grouped by module_name.
     */
    @GetMapping
    public ResponseEntity<Map<String, List<PermissionResponseDto>>> listPermissionsGrouped() {
        return ResponseEntity.ok(permissionService.listPermissionsGrouped());
    }

    /**
     * List all permissions assigned to a role (by role id). Returns list of permission ids.
     */
    @GetMapping("/role/{roleId}")
    public ResponseEntity<List<Long>> rolePermissions(@PathVariable Integer roleId) {
        return ResponseEntity.ok(permissionService.getPermissionIdsForRole(roleId));
    }

    /**
     * Assign permissions to a role - replaces all.
     */
    @PostMapping("/role/{roleId}")
    public ResponseEntity<Void> assignRolePermissions(@PathVariable Integer roleId,
                                                      @RequestBody List<Long> permissionIds) {
        permissionService.assignPermissionsToRole(roleId, permissionIds);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
