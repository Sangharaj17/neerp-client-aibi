package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_capacity_type")
@Setter
@Getter
public class CapacityType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String type;

    @Column(name = "field_key")
    private String fieldKey;

    @Column(name = "form_key")
    private String formKey;
}