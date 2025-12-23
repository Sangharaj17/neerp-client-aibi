package com.aibi.neerp.quotation.jobsActivities.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_ni_job_activity_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NiJobActivityType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_name", nullable = false, unique = true)
    private String typeName;

    @Column(name = "status", nullable = false)
    private Boolean status;
}

