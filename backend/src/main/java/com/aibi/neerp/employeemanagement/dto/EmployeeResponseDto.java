package com.aibi.neerp.employeemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeResponseDto {
    private Integer employeeId;
    private String employeeName;
}
