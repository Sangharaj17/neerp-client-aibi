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

    // Keep explicit name for backward compatibility with existing databases
    @Column(name = "unitname", nullable = false, unique = true)
    private String unitName;

    private String description;
}