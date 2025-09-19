package com.aibi.neerp.leadmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_lead_stage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeadStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stage_id")
    private Integer stageId;

    @Column(name = "stage_name", length = 255)
    private String stageName;
}

