package com.aibi.neerp.amc.common.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_job_activity_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobActivityType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_activity_type_id")
    private Long id;

    @Column(name = "activity_name", nullable = false, unique = true, length = 100)
    private String activityName;

    @Column(name = "description")
    private String description;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}

