package com.aibi.neerp.userresource.controller;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.userresource.entity.EmployeeInTime;
import com.aibi.neerp.userresource.service.EmployeeInTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee-in-time")
@CrossOrigin
public class EmployeeInTimeController {

    @Autowired
    private EmployeeInTimeService employeeInTimeService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping
    public ResponseEntity<EmployeeInTime> createEmployeeInTime(@RequestBody Map<String, Object> request) {
        try {
            // Extract data from request
            Integer employeeId = (Integer) request.get("employeeId");
            Integer inTimeHours = (Integer) request.get("inTimeHours");
            Integer inTimeMinutes = (Integer) request.get("inTimeMinutes");
            String dateStr = (String) request.get("date");
            String assignedWork = (String) request.get("assignedWork");

            // Validate required fields
            if (employeeId == null || inTimeHours == null || inTimeMinutes == null || dateStr == null) {
                return ResponseEntity.badRequest().build();
            }

            // Parse and validate date
            LocalDate date = LocalDate.parse(dateStr);
            LocalDate today = LocalDate.now();
            
            // Check if date is in the past
            if (date.isBefore(today)) {
                throw new IllegalArgumentException("Cannot mark in-time for past dates. Please select today's date or a future date.");
            }

            // Find employee
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            // Create EmployeeInTime object
            EmployeeInTime employeeInTime = new EmployeeInTime();
            employeeInTime.setEmployee(employee);
            employeeInTime.setInTimeHours(inTimeHours);
            employeeInTime.setInTimeMinutes(inTimeMinutes);
            employeeInTime.setDate(date);
            employeeInTime.setAssignedWork(assignedWork);

            EmployeeInTime saved = employeeInTimeService.createEmployeeInTime(employeeInTime);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<EmployeeInTime>> getAllEmployeeInTimes() {
        return ResponseEntity.ok(employeeInTimeService.getAllEmployeeInTimes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeInTime> getEmployeeInTimeById(@PathVariable Integer id) {
        EmployeeInTime inTime = employeeInTimeService.getEmployeeInTimeById(id);
        if (inTime != null) {
            return ResponseEntity.ok(inTime);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeeInTime>> getEmployeeInTimesByEmployeeId(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(employeeInTimeService.getEmployeeInTimesByEmployeeId(employeeId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeInTime> updateEmployeeInTime(@PathVariable Integer id, @RequestBody Map<String, Object> request) {
        try {
            EmployeeInTime existing = employeeInTimeService.getEmployeeInTimeById(id);
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
            if (request.containsKey("inTimeHours")) {
                existing.setInTimeHours((Integer) request.get("inTimeHours"));
            }
            if (request.containsKey("inTimeMinutes")) {
                existing.setInTimeMinutes((Integer) request.get("inTimeMinutes"));
            }
            if (request.containsKey("date")) {
                LocalDate newDate = LocalDate.parse((String) request.get("date"));
                LocalDate today = LocalDate.now();
                
                // Check if date is in the past
                if (newDate.isBefore(today)) {
                    throw new IllegalArgumentException("Cannot mark in-time for past dates. Please select today's date or a future date.");
                }
                
                existing.setDate(newDate);
            }
            if (request.containsKey("assignedWork")) {
                existing.setAssignedWork((String) request.get("assignedWork"));
            }

            EmployeeInTime updated = employeeInTimeService.updateEmployeeInTime(id, existing);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployeeInTime(@PathVariable Integer id) {
        employeeInTimeService.deleteEmployeeInTime(id);
        return ResponseEntity.noContent().build();
    }
}

