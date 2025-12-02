package com.aibi.neerp.userresource.entity;

import com.aibi.neerp.employeemanagement.entity.Employee;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "tbl_employee_leave")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeLeave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leave_id")
    private Integer leaveId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false, referencedColumnName = "employee_id")
    private Employee employee;

    @Column(name = "leave_type", nullable = false, length = 50)
    private String leaveType; // "Full Day" or "Half Day"

    @Column(name = "leave_from_date", nullable = false)
    private LocalDate leaveFromDate;

    @Column(name = "leave_to_date", nullable = false)
    private LocalDate leaveToDate;

    @Column(name = "leave_reason", nullable = false, columnDefinition = "TEXT")
    private String leaveReason;
}

