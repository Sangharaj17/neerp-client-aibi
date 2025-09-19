package com.aibi.neerp.leadmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_project_stage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "stage_name", length = 255, nullable = false)
    private String stageName;
}

