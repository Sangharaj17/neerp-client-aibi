package com.aibi.neerp.leadmanagement.inspectionreport.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_inspection_checkpoint_status")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionCheckpointStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String statusName; // OK, NOT OK, NA etc.
}
