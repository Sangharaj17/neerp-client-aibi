package com.aibi.neerp.amc.materialrepair.entity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // 👈 Essential: Marks the class as a JPA entity
@Table(name = "tbl_work_period") // 👈 Maps the entity to a specific database table
@Data 
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class WorkPeriod {

    @Id // 👈 Marks the field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 👈 Configures auto-generation of the ID by the database
    private Long workPeriodId;

    @Column(name = "period_name", nullable = false, length = 100) // 👈 Optional: Configures column details
    private String name;
}