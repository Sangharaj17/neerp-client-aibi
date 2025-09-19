package com.aibi.neerp.leadmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

import com.aibi.neerp.employeemanagement.entity.Employee;

@Entity
@Table(name = "tbl_activity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeadTodoActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_id")
    private Integer activityId;

    @ManyToOne
    @JoinColumn(name = "lead_id", referencedColumnName = "lead_id")
    private NewLeads lead;

    @ManyToOne
    @JoinColumn(name = "todo_id", referencedColumnName = "todo_id")
    private LeadTodo todo;

    @ManyToOne
    @JoinColumn(name = "activity_by", referencedColumnName = "employee_id")
    private Employee activityBy;

    @Column(name = "activity_title", length = 255)
    private String activityTitle;

    @Column(name = "feedback", length = 255)
    private String feedback;

    @Column(name = "activity_date")
    private LocalDate activityDate;

    @Column(name = "activity_time", length = 255)
    private String activityTime;
}

