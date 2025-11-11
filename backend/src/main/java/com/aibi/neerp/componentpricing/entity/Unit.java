package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_unit")
@Setter
@Getter
public class Unit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Note: Temporarily using explicit column name for production compatibility
    // Once DatabaseColumnNamingFixer renames unitname → unit_name in production, this can be removed
    @Column(name = "unitname", nullable = false, unique = true)
    private String unitName;

    private String description;
}