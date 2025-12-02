package com.aibi.neerp.userresource.controller;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.userresource.entity.EmployeeLeave;
import com.aibi.neerp.userresource.service.EmployeeLeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee-leave")
@CrossOrigin
public class EmployeeLeaveController {

    @Autowired
    private EmployeeLeaveService employeeLeaveService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping
    public ResponseEntity<EmployeeLeave> createEmployeeLeave(@RequestBody Map<String, Object> request) {
        try {
            // Extract data from request
            Integer employeeId = (Integer) request.get("employeeId");
            String leaveType = (String) request.get("leaveType");
            String leaveFromDateStr = (String) request.get("leaveFromDate");
            String leaveToDateStr = (String) request.get("leaveToDate");
            String leaveReason = (String) request.get("leaveReason");

            // Validate required fields
            if (employeeId == null || leaveType == null || leaveType.trim().isEmpty() ||
                leaveFromDateStr == null || leaveToDateStr == null || leaveReason == null || leaveReason.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            // Validate leave type
            if (!leaveType.equals("Full Day") && !leaveType.equals("Half Day")) {
                return ResponseEntity.badRequest().build();
            }

            // Find employee
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            // Parse dates
            LocalDate leaveFromDate = java.time.LocalDate.parse(leaveFromDateStr);
            LocalDate leaveToDate = java.time.LocalDate.parse(leaveToDateStr);

            // Validate date range
            if (leaveToDate.isBefore(leaveFromDate)) {
                return ResponseEntity.badRequest().build();
            }

            // Create EmployeeLeave object
            EmployeeLeave employeeLeave = new EmployeeLeave();
            employeeLeave.setEmployee(employee);
            employeeLeave.setLeaveType(leaveType);
            employeeLeave.setLeaveFromDate(leaveFromDate);
            employeeLeave.setLeaveToDate(leaveToDate);
            employeeLeave.setLeaveReason(leaveReason.trim());

            EmployeeLeave saved = employeeLeaveService.createEmployeeLeave(employeeLeave);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<EmployeeLeave>> getAllEmployeeLeaves() {
        return ResponseEntity.ok(employeeLeaveService.getAllEmployeeLeaves());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeLeave> getEmployeeLeaveById(@PathVariable Integer id) {
        EmployeeLeave leave = employeeLeaveService.getEmployeeLeaveById(id);
        if (leave != null) {
            return ResponseEntity.ok(leave);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeeLeave>> getEmployeeLeavesByEmployeeId(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(employeeLeaveService.getEmployeeLeavesByEmployeeId(employeeId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeLeave> updateEmployeeLeave(@PathVariable Integer id, @RequestBody Map<String, Object> request) {
        try {
            EmployeeLeave existing = employeeLeaveService.getEmployeeLeaveById(id);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }

            // Update fields if provided
            if (request.containsKey("employeeId")) {
                Integer employeeId = (Integer) request.get("employeeId");
                Employee employee = employeeRepository.findById(employeeId)
                        .orElseThrow(() -> new RuntimeException("Employee not found"));
                existing.setEmployee(employee);
            }
            if (request.containsKey("leaveType")) {
                String leaveType = (String) request.get("leaveType");
                if (leaveType.equals("Full Day") || leaveType.equals("Half Day")) {
                    existing.setLeaveType(leaveType);
                }
            }
            if (request.containsKey("leaveFromDate")) {
                existing.setLeaveFromDate(java.time.LocalDate.parse((String) request.get("leaveFromDate")));
            }
            if (request.containsKey("leaveToDate")) {
                existing.setLeaveToDate(java.time.LocalDate.parse((String) request.get("leaveToDate")));
            }
            if (request.containsKey("leaveReason")) {
                existing.setLeaveReason((String) request.get("leaveReason"));
            }

            EmployeeLeave updated = employeeLeaveService.updateEmployeeLeave(id, existing);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployeeLeave(@PathVariable Integer id) {
        employeeLeaveService.deleteEmployeeLeave(id);
        return ResponseEntity.noContent().build();
    }
}

