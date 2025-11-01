package com.aibi.neerp.rolebackmanagement.service;

import com.aibi.neerp.rolebackmanagement.entity.Role;
import com.aibi.neerp.rolebackmanagement.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public Role createRole(Role role) {
        return roleRepository.save(role);
    }
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
    public Role getRoleById(Integer id) {
        Optional<Role> r = roleRepository.findById(id);
        return r.orElse(null);
    }
    public Role updateRole(Integer id, Role updated) {
        return roleRepository.findById(id)
                .map(existing -> {
                    existing.setRole(updated.getRole());
                    return roleRepository.save(existing);
                })
                .orElse(null);
    }
    public void deleteRole(Integer id) {
        roleRepository.deleteById(id);
    }
}
