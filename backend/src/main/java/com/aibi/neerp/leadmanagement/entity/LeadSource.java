package com.aibi.neerp.leadmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_lead_source")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeadSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lead_source_id")
    private Integer leadSourceId;

    @Column(name = "source_name", length = 255)
    private String sourceName;
}

