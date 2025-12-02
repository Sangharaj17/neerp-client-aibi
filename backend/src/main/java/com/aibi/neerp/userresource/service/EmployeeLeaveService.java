package com.aibi.neerp.userresource.service;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.userresource.entity.EmployeeLeave;
import com.aibi.neerp.userresource.repository.EmployeeLeaveRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class EmployeeLeaveService {
    
    @Autowired
    private EmployeeLeaveRepository employeeLeaveRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public EmployeeLeave createEmployeeLeave(EmployeeLeave employeeLeave) {
        try {
            EmployeeLeave saved = employeeLeaveRepository.save(employeeLeave);
            log.info("Employee leave created successfully with ID: {}", saved.getLeaveId());
            return saved;
        } catch (Exception e) {
            log.error("Error creating employee leave", e);
            throw e;
        }
    }

    public List<EmployeeLeave> getAllEmployeeLeaves() {
        return employeeLeaveRepository.findAll();
    }

    public EmployeeLeave getEmployeeLeaveById(Integer id) {
        Optional<EmployeeLeave> leave = employeeLeaveRepository.findById(id);
        return leave.orElse(null);
    }

    public List<EmployeeLeave> getEmployeeLeavesByEmployeeId(Integer employeeId) {
        return employeeLeaveRepository.findByEmployee_EmployeeId(employeeId);
    }

    public EmployeeLeave updateEmployeeLeave(Integer id, EmployeeLeave updated) {
        return employeeLeaveRepository.findById(id)
                .map(existing -> {
                    if (updated.getEmployee() != null) {
                        existing.setEmployee(updated.getEmployee());
                    }
                    if (updated.getLeaveType() != null) {
                        existing.setLeaveType(updated.getLeaveType());
                    }
                    if (updated.getLeaveFromDate() != null) {
                        existing.setLeaveFromDate(updated.getLeaveFromDate());
                    }
                    if (updated.getLeaveToDate() != null) {
                        existing.setLeaveToDate(updated.getLeaveToDate());
                    }
                    if (updated.getLeaveReason() != null) {
                        existing.setLeaveReason(updated.getLeaveReason());
                    }
                    return employeeLeaveRepository.save(existing);
                })
                .orElse(null);
    }

    public void deleteEmployeeLeave(Integer id) {
        employeeLeaveRepository.deleteById(id);
    }
}

