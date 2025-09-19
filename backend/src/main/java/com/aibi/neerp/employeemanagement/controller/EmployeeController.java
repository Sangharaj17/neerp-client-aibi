package com.aibi.neerp.employeemanagement.controller;

import com.aibi.neerp.employeemanagement.dto.EmployeeResponseDto;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
    
    @GetMapping("/executives")
    public List<EmployeeResponseDto> getExecutiveList() {
        return employeeRepository.findAll().stream()
                .map(emp -> new EmployeeResponseDto(emp.getEmployeeId(), emp.getEmployeeName()))
                .toList();
    }

}
