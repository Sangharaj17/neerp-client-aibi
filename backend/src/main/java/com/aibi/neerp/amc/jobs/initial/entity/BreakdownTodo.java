package com.aibi.neerp.amc.jobs.initial.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.aibi.neerp.amc.common.entity.JobActivityType;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.employeemanagement.entity.Employee;

@Entity
@Table(name = "tbl_breakdown_todo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BreakdownTodo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cust_todo_id")
    private Integer custTodoId;

    @ManyToOne
    @JoinColumn(name = "customer_site_id", referencedColumnName = "site_id")
    private Site customerSite;

    @ManyToOne
    @JoinColumn(name = "activity_by", referencedColumnName = "employee_id")
    private Employee activityBy;

    @Column(name = "purpose", nullable = false)
    private String purpose;

    @Column(name = "todo_date", nullable = false)
    private LocalDate todoDate; // Changed to String

    @Column(name = "time", nullable = false)
    private LocalTime time; 
    
    @Column(name = "venue", nullable = false)
    private String venue;

    @ManyToOne
    @JoinColumn(name = "job_activity_type", referencedColumnName = "job_activity_type_id")
    private JobActivityType jobActivityType; // Changed to FK

    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "complaint_name")
    private String complaintName;

    @Column(name = "compalint_mob")
    private String complaintMob;

    @ManyToOne
    @JoinColumn(name = "job_id", referencedColumnName = "job_id")
    private AmcJob job; // New FK

    @OneToMany(mappedBy = "breakdownTodo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BreakdownTodoLiftMapping> lifts;
}

