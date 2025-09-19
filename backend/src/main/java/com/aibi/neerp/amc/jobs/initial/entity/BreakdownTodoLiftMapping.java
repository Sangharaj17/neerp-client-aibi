package com.aibi.neerp.amc.jobs.initial.entity;


import com.aibi.neerp.leadmanagement.entity.Enquiry;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_breakdown_todo_lift_mapping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BreakdownTodoLiftMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "cust_todo_id", referencedColumnName = "cust_todo_id")
    private BreakdownTodo breakdownTodo;

    @ManyToOne
    @JoinColumn(name = "lift_id", referencedColumnName = "enquiry_id")
    private Enquiry lift;
}

