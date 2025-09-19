package com.aibi.neerp.leadmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

import com.aibi.neerp.employeemanagement.entity.Employee;

@Entity
@Table(name = "tbl_todo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeadTodo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "todo_id")
    private Integer todoId;

    @ManyToOne
    @JoinColumn(name = "lead_id", referencedColumnName = "lead_id")
    private NewLeads lead;

    @ManyToOne
    @JoinColumn(name = "activity_by", referencedColumnName = "employee_id")
    private Employee activityBy;

    @Column(name = "purpose", length = 255)
    private String purpose;

    @Column(name = "todo_date")
    private LocalDate todoDate;

    @Column(name = "time", length = 255)
    private String time;

    @Column(name = "venue", length = 255)
    private String venue;

//    @Column(name = "activity_id")
//    private Integer activityId;

    @OneToMany(mappedBy = "todo")
    private List<LeadTodoActivity> activity;
}
