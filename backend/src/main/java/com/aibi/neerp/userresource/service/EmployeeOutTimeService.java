package com.aibi.neerp.userresource.service;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.userresource.entity.EmployeeOutTime;
import com.aibi.neerp.userresource.repository.EmployeeOutTimeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class EmployeeOutTimeService {
    
    @Autowired
    private EmployeeOutTimeRepository employeeOutTimeRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public EmployeeOutTime createEmployeeOutTime(EmployeeOutTime employeeOutTime) {
        try {
            EmployeeOutTime saved = employeeOutTimeRepository.save(employeeOutTime);
            log.info("Employee out time created successfully with ID: {}", saved.getOutTimeId());
            return saved;
        } catch (Exception e) {
            log.error("Error creating employee out time", e);
            throw e;
        }
    }

    public List<EmployeeOutTime> getAllEmployeeOutTimes() {
        return employeeOutTimeRepository.findAll();
    }

    public EmployeeOutTime getEmployeeOutTimeById(Integer id) {
        Optional<EmployeeOutTime> outTime = employeeOutTimeRepository.findById(id);
        return outTime.orElse(null);
    }

    public List<EmployeeOutTime> getEmployeeOutTimesByEmployeeId(Integer employeeId) {
        return employeeOutTimeRepository.findByEmployee_EmployeeId(employeeId);
    }

    public EmployeeOutTime updateEmployeeOutTime(Integer id, EmployeeOutTime updated) {
        return employeeOutTimeRepository.findById(id)
                .map(existing -> {
                    if (updated.getEmployee() != null) {
                        existing.setEmployee(updated.getEmployee());
                    }
                    if (updated.getOutTimeHours() != null) {
                        existing.setOutTimeHours(updated.getOutTimeHours());
                    }
                    if (updated.getOutTimeMinutes() != null) {
                        existing.setOutTimeMinutes(updated.getOutTimeMinutes());
                    }
                    if (updated.getDate() != null) {
                        existing.setDate(updated.getDate());
                    }
                    if (updated.getTodaysSummary() != null) {
                        existing.setTodaysSummary(updated.getTodaysSummary());
                    }
                    return employeeOutTimeRepository.save(existing);
                })
                .orElse(null);
    }

    public void deleteEmployeeOutTime(Integer id) {
        employeeOutTimeRepository.deleteById(id);
    }
}

