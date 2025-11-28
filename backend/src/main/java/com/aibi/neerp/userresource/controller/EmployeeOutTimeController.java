package com.aibi.neerp.userresource.controller;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.userresource.entity.EmployeeOutTime;
import com.aibi.neerp.userresource.service.EmployeeOutTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee-out-time")
@CrossOrigin
public class EmployeeOutTimeController {

    @Autowired
    private EmployeeOutTimeService employeeOutTimeService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping
    public ResponseEntity<EmployeeOutTime> createEmployeeOutTime(@RequestBody Map<String, Object> request) {
        try {
            // Extract data from request
            Integer employeeId = (Integer) request.get("employeeId");
            Integer outTimeHours = (Integer) request.get("outTimeHours");
            Integer outTimeMinutes = (Integer) request.get("outTimeMinutes");
            String dateStr = (String) request.get("date");
            String todaysSummary = (String) request.get("todaysSummary");

            // Validate required fields
            if (employeeId == null || outTimeHours == null || outTimeMinutes == null || dateStr == null || todaysSummary == null || todaysSummary.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            // Parse and validate date
            LocalDate date = LocalDate.parse(dateStr);
            LocalDate today = LocalDate.now();
            
            // Check if date is in the past
            if (date.isBefore(today)) {
                throw new IllegalArgumentException("Cannot mark out-time for past dates. Please select today's date or a future date.");
            }

            // Find employee
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            // Create EmployeeOutTime object
            EmployeeOutTime employeeOutTime = new EmployeeOutTime();
            employeeOutTime.setEmployee(employee);
            employeeOutTime.setOutTimeHours(outTimeHours);
            employeeOutTime.setOutTimeMinutes(outTimeMinutes);
            employeeOutTime.setDate(date);
            employeeOutTime.setTodaysSummary(todaysSummary.trim());

            EmployeeOutTime saved = employeeOutTimeService.createEmployeeOutTime(employeeOutTime);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<EmployeeOutTime>> getAllEmployeeOutTimes() {
        return ResponseEntity.ok(employeeOutTimeService.getAllEmployeeOutTimes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeOutTime> getEmployeeOutTimeById(@PathVariable Integer id) {
        EmployeeOutTime outTime = employeeOutTimeService.getEmployeeOutTimeById(id);
        if (outTime != null) {
            return ResponseEntity.ok(outTime);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeeOutTime>> getEmployeeOutTimesByEmployeeId(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(employeeOutTimeService.getEmployeeOutTimesByEmployeeId(employeeId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeOutTime> updateEmployeeOutTime(@PathVariable Integer id, @RequestBody Map<String, Object> request) {
        try {
            EmployeeOutTime existing = employeeOutTimeService.getEmployeeOutTimeById(id);
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
            if (request.containsKey("outTimeHours")) {
                existing.setOutTimeHours((Integer) request.get("outTimeHours"));
            }
            if (request.containsKey("outTimeMinutes")) {
                existing.setOutTimeMinutes((Integer) request.get("outTimeMinutes"));
            }
            if (request.containsKey("date")) {
                LocalDate newDate = LocalDate.parse((String) request.get("date"));
                LocalDate today = LocalDate.now();
                
                // Check if date is in the past
                if (newDate.isBefore(today)) {
                    throw new IllegalArgumentException("Cannot mark out-time for past dates. Please select today's date or a future date.");
                }
                
                existing.setDate(newDate);
            }
            if (request.containsKey("todaysSummary")) {
                existing.setTodaysSummary((String) request.get("todaysSummary"));
            }

            EmployeeOutTime updated = employeeOutTimeService.updateEmployeeOutTime(id, existing);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployeeOutTime(@PathVariable Integer id) {
        employeeOutTimeService.deleteEmployeeOutTime(id);
        return ResponseEntity.noContent().build();
    }
}

