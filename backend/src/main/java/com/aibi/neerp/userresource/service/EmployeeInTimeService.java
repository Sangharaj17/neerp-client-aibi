package com.aibi.neerp.userresource.service;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.userresource.entity.EmployeeInTime;
import com.aibi.neerp.userresource.repository.EmployeeInTimeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class EmployeeInTimeService {
    
    @Autowired
    private EmployeeInTimeRepository employeeInTimeRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public EmployeeInTime createEmployeeInTime(EmployeeInTime employeeInTime) {
        try {
            EmployeeInTime saved = employeeInTimeRepository.save(employeeInTime);
            log.info("Employee in time created successfully with ID: {}", saved.getInTimeId());
            return saved;
        } catch (Exception e) {
            log.error("Error creating employee in time", e);
            throw e;
        }
    }

    public List<EmployeeInTime> getAllEmployeeInTimes() {
        return employeeInTimeRepository.findAll();
    }

    public EmployeeInTime getEmployeeInTimeById(Integer id) {
        Optional<EmployeeInTime> inTime = employeeInTimeRepository.findById(id);
        return inTime.orElse(null);
    }

    public List<EmployeeInTime> getEmployeeInTimesByEmployeeId(Integer employeeId) {
        return employeeInTimeRepository.findByEmployee_EmployeeId(employeeId);
    }

    public EmployeeInTime updateEmployeeInTime(Integer id, EmployeeInTime updated) {
        return employeeInTimeRepository.findById(id)
                .map(existing -> {
                    if (updated.getEmployee() != null) {
                        existing.setEmployee(updated.getEmployee());
                    }
                    if (updated.getInTimeHours() != null) {
                        existing.setInTimeHours(updated.getInTimeHours());
                    }
                    if (updated.getInTimeMinutes() != null) {
                        existing.setInTimeMinutes(updated.getInTimeMinutes());
                    }
                    if (updated.getDate() != null) {
                        existing.setDate(updated.getDate());
                    }
                    if (updated.getAssignedWork() != null) {
                        existing.setAssignedWork(updated.getAssignedWork());
                    }
                    return employeeInTimeRepository.save(existing);
                })
                .orElse(null);
    }

    public void deleteEmployeeInTime(Integer id) {
        employeeInTimeRepository.deleteById(id);
    }
}

