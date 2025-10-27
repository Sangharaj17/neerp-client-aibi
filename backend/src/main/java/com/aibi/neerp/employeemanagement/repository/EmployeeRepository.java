package com.aibi.neerp.employeemanagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.employeemanagement.entity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

	boolean existsByUsername(String string);

    Optional<Employee> findByEmployeeCode(String employeeCode);
	

}

