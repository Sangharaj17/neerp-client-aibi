package com.aibi.neerp.amc.jobs.initial.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDto {
    private Integer employeeId;
    private String name;
    private String role;
    private String address;
}

