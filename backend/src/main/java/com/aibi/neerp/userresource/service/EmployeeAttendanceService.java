package com.aibi.neerp.userresource.service;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.userresource.dto.EmployeeAttendanceDTO;
import com.aibi.neerp.userresource.entity.EmployeeInTime;
import com.aibi.neerp.userresource.entity.EmployeeLeave;
import com.aibi.neerp.userresource.entity.EmployeeOutTime;
import com.aibi.neerp.userresource.repository.EmployeeInTimeRepository;
import com.aibi.neerp.userresource.repository.EmployeeLeaveRepository;
import com.aibi.neerp.userresource.repository.EmployeeOutTimeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class EmployeeAttendanceService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeInTimeRepository employeeInTimeRepository;

    @Autowired
    private EmployeeOutTimeRepository employeeOutTimeRepository;

    @Autowired
    private EmployeeLeaveRepository employeeLeaveRepository;

    public List<EmployeeAttendanceDTO> getEmployeeAttendance(LocalDate fromDate, LocalDate toDate, Integer employeeId) {
        List<Employee> employees;
        
        if (employeeId != null) {
            employees = employeeRepository.findById(employeeId)
                    .map(Collections::singletonList)
                    .orElse(Collections.emptyList());
        } else {
            employees = employeeRepository.findAll();
        }

        List<EmployeeAttendanceDTO> attendanceList = new ArrayList<>();

        for (Employee employee : employees) {
            EmployeeAttendanceDTO dto = new EmployeeAttendanceDTO();
            dto.setEmployeeId(employee.getEmployeeId());
            dto.setEmployeeName(employee.getEmployeeName());

            Map<String, String> dailyAttendance = new LinkedHashMap<>();
            int presentCount = 0;
            int absentCount = 0;
            int leaveCount = 0;

            // Get all in-times, out-times, and leaves for the date range
            List<EmployeeInTime> inTimes = employeeInTimeRepository.findByEmployee_EmployeeId(employee.getEmployeeId())
                    .stream()
                    .filter(it -> !it.getDate().isBefore(fromDate) && !it.getDate().isAfter(toDate))
                    .collect(Collectors.toList());

            List<EmployeeOutTime> outTimes = employeeOutTimeRepository.findByEmployee_EmployeeId(employee.getEmployeeId())
                    .stream()
                    .filter(ot -> !ot.getDate().isBefore(fromDate) && !ot.getDate().isAfter(toDate))
                    .collect(Collectors.toList());

            List<EmployeeLeave> leaves = employeeLeaveRepository.findByEmployee_EmployeeId(employee.getEmployeeId())
                    .stream()
                    .filter(l -> !l.getLeaveFromDate().isAfter(toDate) && !l.getLeaveToDate().isBefore(fromDate))
                    .collect(Collectors.toList());

            // Create a map of dates to leave records
            Map<LocalDate, EmployeeLeave> leaveMap = new HashMap<>();
            for (EmployeeLeave leave : leaves) {
                LocalDate currentDate = leave.getLeaveFromDate();
                while (!currentDate.isAfter(leave.getLeaveToDate()) && !currentDate.isAfter(toDate) && !currentDate.isBefore(fromDate)) {
                    leaveMap.put(currentDate, leave);
                    currentDate = currentDate.plusDays(1);
                }
            }

            // Process each day in the range
            LocalDate currentDate = fromDate;
            while (!currentDate.isAfter(toDate)) {
                final LocalDate dateToCheck = currentDate; // Make effectively final for lambda
                String dateKey = currentDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                int dayOfWeek = currentDate.getDayOfWeek().getValue(); // 1 = Monday, 7 = Sunday

                // Check if it's a Sunday
                if (dayOfWeek == 7) {
                    dailyAttendance.put(dateKey, "-");
                } else if (leaveMap.containsKey(currentDate)) {
                    // Employee is on leave
                    dailyAttendance.put(dateKey, "L");
                    leaveCount++;
                } else {
                    // Check if employee has in-time and out-time for this date
                    boolean hasInTime = inTimes.stream().anyMatch(it -> it.getDate().equals(dateToCheck));
                    boolean hasOutTime = outTimes.stream().anyMatch(ot -> ot.getDate().equals(dateToCheck));

                    if (hasInTime && hasOutTime) {
                        dailyAttendance.put(dateKey, "P");
                        presentCount++;
                    } else {
                        dailyAttendance.put(dateKey, "A");
                        absentCount++;
                    }
                }

                currentDate = currentDate.plusDays(1);
            }

            dto.setDailyAttendance(dailyAttendance);
            dto.setPresent(presentCount);
            dto.setAbsent(absentCount);
            dto.setLeave(leaveCount);
            attendanceList.add(dto);
        }

        // Sort by employee name
        attendanceList.sort(Comparator.comparing(EmployeeAttendanceDTO::getEmployeeName));

        return attendanceList;
    }
}

