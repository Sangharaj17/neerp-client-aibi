package com.aibi.neerp.amc.jobs.initial.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import com.aibi.neerp.employeemanagement.entity.Employee;

@Entity
@Table(name = "tbl_routes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Routes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id")
    private Integer routeId;

    @Column(name = "route_name", nullable = false)
    private String routeName;

    // Many-to-Many with join table
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "tbl_route_employee",
            joinColumns = @JoinColumn(name = "route_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private List<Employee> employees;
}
