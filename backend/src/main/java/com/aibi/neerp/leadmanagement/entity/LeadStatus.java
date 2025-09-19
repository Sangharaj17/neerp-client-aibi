package com.aibi.neerp.leadmanagement.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lead_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "status_name", nullable = false, unique = true)
    private String statusName;

    @Column(name = "description")
    private String description;
}
