package com.aibi.neerp.rolebackmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_role_permission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RolePermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK to tbl_role
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    // FK to tbl_permission
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_id")
    private Permission permission;

    @Column(name = "active")
    private Boolean active = true;
}
