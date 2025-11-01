package com.aibi.neerp.employeemanagement.controller;

import com.aibi.neerp.employeemanagement.dto.EmployeeResponseDto;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Employee saved = employeeRepository.save(employee);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Integer id, @RequestBody Employee updated) {
        return employeeRepository.findById(id)
                .map(existing -> {
                    updated.setEmployeeId(existing.getEmployeeId());
                    Employee saved = employeeRepository.save(updated);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Integer id) {
        if (!employeeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        employeeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
