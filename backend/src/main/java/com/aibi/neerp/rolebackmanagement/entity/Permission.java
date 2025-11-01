package com.aibi.neerp.rolebackmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_permission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "module_id")
    private Long moduleId;

    @Column(name = "module_name")
    private String moduleName;

    @Column(name = "feature_id")
    private Integer featureId;

    @Column(name = "feature_name")
    private String featureName;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
