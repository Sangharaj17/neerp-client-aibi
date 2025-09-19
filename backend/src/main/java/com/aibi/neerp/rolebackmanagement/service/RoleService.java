package com.aibi.neerp.rolebackmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.rolebackmanagement.entity.Role;
import com.aibi.neerp.rolebackmanagement.repository.RoleRepository;

@Service
public class RoleService {

	@Autowired
    private  RoleRepository roleRepository;

    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Role getRoleById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
    }

    public void deleteRole(Integer id) {
        Role role = getRoleById(id);
        roleRepository.delete(role);
    }

    public Role updateRole(Integer id, Role updatedRole) {
        Role existing = getRoleById(id);
        existing.setRole(updatedRole.getRole());
        return roleRepository.save(existing);
    }
}
