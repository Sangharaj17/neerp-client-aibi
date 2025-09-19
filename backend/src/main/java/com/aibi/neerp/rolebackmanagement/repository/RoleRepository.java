package com.aibi.neerp.rolebackmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.rolebackmanagement.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

	boolean existsByRole(String r);

	Object findByRole(String string);}

