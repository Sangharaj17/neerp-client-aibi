package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_weight",
        uniqueConstraints = @UniqueConstraint(columnNames = {"unit_id", "weight_value", "capacity_type_id"}))
@Setter
@Getter
public class Weight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "unit_id", nullable = false)
    private Unit unit;

    @Column(name = "weight_value", nullable = false)
    private Integer weightValue;

    @ManyToOne
    @JoinColumn(name = "capacity_type_id", nullable = false)
    private CapacityType capacityType;
}
