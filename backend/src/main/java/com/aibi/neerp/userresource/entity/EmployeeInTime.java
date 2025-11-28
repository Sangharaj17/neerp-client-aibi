package com.aibi.neerp.userresource.entity;

import com.aibi.neerp.employeemanagement.entity.Employee;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "tbl_employee_in_time")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeInTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "in_time_id")
    private Integer inTimeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false, referencedColumnName = "employee_id")
    private Employee employee;

    @Column(name = "in_time_hours", nullable = false)
    private Integer inTimeHours;

    @Column(name = "in_time_minutes", nullable = false)
    private Integer inTimeMinutes;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "assigned_work", columnDefinition = "TEXT")
    private String assignedWork;
}

