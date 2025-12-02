package com.aibi.neerp.userresource.dto;

import lombok.Data;
import java.util.Map;

@Data
public class EmployeeAttendanceDTO {
    private Integer employeeId;
    private String employeeName;
    private Map<String, String> dailyAttendance; // Key: date (YYYY-MM-DD), Value: status (P/A/L/-)
    private Integer present;
    private Integer absent;
    private Integer leave;
}

