package com.aibi.neerp.userresource.controller;

import com.aibi.neerp.userresource.dto.EmployeeAttendanceDTO;
import com.aibi.neerp.userresource.service.EmployeeAttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/employee-attendance")
@CrossOrigin
public class EmployeeAttendanceController {

    @Autowired
    private EmployeeAttendanceService employeeAttendanceService;

    @GetMapping
    public ResponseEntity<List<EmployeeAttendanceDTO>> getEmployeeAttendance(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(required = false) Integer employeeId) {
        
        try {
            LocalDate from = fromDate != null ? LocalDate.parse(fromDate) : LocalDate.now().withDayOfMonth(1);
            LocalDate to = toDate != null ? LocalDate.parse(toDate) : LocalDate.now();
            
            List<EmployeeAttendanceDTO> attendance = employeeAttendanceService.getEmployeeAttendance(from, to, employeeId);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}

