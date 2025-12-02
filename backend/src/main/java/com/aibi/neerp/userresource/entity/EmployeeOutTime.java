package com.aibi.neerp.userresource.entity;

import com.aibi.neerp.employeemanagement.entity.Employee;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "tbl_employee_out_time")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeOutTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "out_time_id")
    private Integer outTimeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false, referencedColumnName = "employee_id")
    private Employee employee;

    @Column(name = "out_time_hours", nullable = false)
    private Integer outTimeHours;

    @Column(name = "out_time_minutes", nullable = false)
    private Integer outTimeMinutes;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "todays_summary", columnDefinition = "TEXT", nullable = false)
    private String todaysSummary;
}

