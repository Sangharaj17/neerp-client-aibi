package com.aibi.neerp.employeemanagement.dto;

import com.aibi.neerp.rolebackmanagement.dto.RoleDto;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private Integer employeeId;
    private String employeeName;
    private String contactNumber;
    private String emailId;
    private String address;
    private LocalDate dob;
    private LocalDate joiningDate;
    private RoleDto role;
    private String username;
    private String empPhoto;
    private Boolean active;
    private String employeeCode;
    private String employeeSign;
    private LocalDateTime createdAt;
}
